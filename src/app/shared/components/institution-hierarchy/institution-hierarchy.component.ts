import { FormControl, Validators } from '@angular/forms';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { tap, filter, takeUntil } from 'rxjs/operators';
import { Provider } from 'src/app/shared/models/provider.model';
import {
  HierarchyElement,
  InstituitionHierarchy,
  Institution,
  InstitutionFieldDescription,
} from 'src/app/shared/models/institution.model';
import { MetaDataState } from 'src/app/shared/store/meta-data.state';
import {
  GetAllByInstitutionAndLevel,
  GetAllInstitutions,
  GetFieldDescriptionByInstitutionId,
  GetInstitutionHierarchyChildrenById,
  GetInstitutionHierarchyParentsById,
  ResetInstitutionHierarchy,
} from 'src/app/shared/store/meta-data.actions';
@Component({
  selector: 'app-institution-hierarchy',
  templateUrl: './institution-hierarchy.component.html',
  styleUrls: ['./institution-hierarchy.component.scss'],
})
export class InstitutionHierarchyComponent implements OnInit, OnDestroy {
  @Input() instituitionHierarchyIdFormControl: FormControl;
  @Input() instituitionIdFormControl: FormControl;
  @Input() provider: Provider;

  @Select(MetaDataState.institutions)
  institutions$: Observable<Institution[]>;
  @Select(MetaDataState.instituitionsHierarchy)
  instituitionsHierarchy$: Observable<InstituitionHierarchy[]>;
  @Select(MetaDataState.editInstituitionsHierarchy)
  editInstituitionsHierarchy$: Observable<InstituitionHierarchy[]>;
  @Select(MetaDataState.institutionFieldDesc)
  institutionFieldDesc$: Observable<InstitutionFieldDescription[]>;
  institutionFieldDesc: InstitutionFieldDescription[];

  destroy$: Subject<boolean> = new Subject<boolean>();
  hierarchyArray: HierarchyElement[] = [];
  private editMode: boolean;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(new GetAllInstitutions());

    this.editMode = !!this.instituitionIdFormControl.value;

    this.setInitialInstitution();
    this.createInstitutioHierarchy();

    if (this.editMode) {
      this.setEditMode();
    }
  }

  private setInitialInstitution(): void {
    const institutionId = this.editMode ? this.instituitionIdFormControl.value : this.provider.institution?.id;
    if (institutionId) {
      this.instituitionIdFormControl.setValue(institutionId, { emitEvent: false });
      this.store.dispatch(new GetFieldDescriptionByInstitutionId(this.instituitionIdFormControl.value));
    }

    this.instituitionIdFormControl.valueChanges.subscribe((institutionId: string) => {
      this.store.dispatch(new GetFieldDescriptionByInstitutionId(institutionId));
    });

    this.instituitionsHierarchy$
      .pipe(
        takeUntil(this.destroy$),
        filter(
          (instituitionsHierarchy: InstituitionHierarchy[]) =>
            !!(instituitionsHierarchy && instituitionsHierarchy.length)
        )
      )
      .subscribe((instituitionsHierarchy: InstituitionHierarchy[]) => {
        const nextLevel = instituitionsHierarchy[0].hierarchyLevel - 1;
        this.hierarchyArray[nextLevel].options = instituitionsHierarchy;
        this.hierarchyArray[nextLevel].shouldDisplay = true;
      });
  }

  private createInstitutioHierarchy(): void {
    this.institutionFieldDesc$
      .pipe(
        takeUntil(this.destroy$),
        filter((institutionFieldDesc: InstitutionFieldDescription[]) => !!institutionFieldDesc),
        tap((institutionFieldDesc: InstitutionFieldDescription[]) =>
          institutionFieldDesc.sort((a, b) => a.hierarchyLevel - b.hierarchyLevel)
        )
      )
      .subscribe((institutionFieldDesc: InstitutionFieldDescription[]) => {
        this.hierarchyArray = [];
        this.institutionFieldDesc = institutionFieldDesc;
        this.createInstitutionFormGroup();
      });
  }

  private createInstitutionFormGroup(): void {
    this.institutionFieldDesc.forEach((institutionFieldDesc: InstitutionFieldDescription) => {
      const hierarchy = {
        formControl: new FormControl('', Validators.required),
        title: institutionFieldDesc.title,
        hierarchyLevel: institutionFieldDesc.hierarchyLevel,
        institutionId: institutionFieldDesc.institutionId,
        shouldDisplay: institutionFieldDesc.hierarchyLevel === 1,
        options: [],
      };

      this.hierarchyArray.push(hierarchy);
    });
    this.store.dispatch(new GetAllByInstitutionAndLevel(this.instituitionIdFormControl.value, 1));
  }

  setEditMode(): void {
    this.store.dispatch(new GetInstitutionHierarchyParentsById(this.instituitionHierarchyIdFormControl.value));

    this.editInstituitionsHierarchy$
      .pipe(
        takeUntil(this.destroy$),
        filter((instituitionsHierarchy: InstituitionHierarchy[]) => !!instituitionsHierarchy)
      )
      .subscribe((instituitionsHierarchy: InstituitionHierarchy[]) => {
        instituitionsHierarchy.forEach((instituitionsHierarchy: InstituitionHierarchy) => {
          this.hierarchyArray[instituitionsHierarchy.hierarchyLevel - 1].formControl.setValue(
            instituitionsHierarchy.id,
            { emitEvent: false }
          );
          this.store.dispatch(new GetInstitutionHierarchyChildrenById(instituitionsHierarchy.id));
        });
      });
  }

  onHierarchyLevelSelect(optionId: string, hierarchy: HierarchyElement): void {
    const nextEl = this.hierarchyArray.indexOf(hierarchy) + 1;
    if (this.hierarchyArray[nextEl]) {
      this.hierarchyArray[nextEl].formControl.setValue('');
      this.hierarchyArray[nextEl].shouldDisplay = false;
      this.store.dispatch(new GetInstitutionHierarchyChildrenById(optionId));
    } else {
      this.instituitionHierarchyIdFormControl.setValue(optionId);
      this.store.dispatch(new ResetInstitutionHierarchy());
    }
  }

  ngOnDestroy(): void {
    this.store.dispatch(new ResetInstitutionHierarchy());
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
