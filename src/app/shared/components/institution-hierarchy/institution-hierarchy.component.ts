import { FormControl, Validators } from '@angular/forms';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { tap, filter, takeUntil } from 'rxjs/operators';
import { Provider } from '../../models/provider.model';
import { HierarchyElement, InstituitionHierarchy, Institution, InstitutionFieldDescription } from '../../models/institution.model';
import { MetaDataState } from '../../store/meta-data.state';
import { GetAllByInstitutionAndLevel, GetAllInstitutions, GetFieldDescriptionByInstitutionId, GetInstitutionHierarchyChildrenById, GetInstitutionHierarchyParentsById, ResetInstitutionHierarchy } from '../../store/meta-data.actions';
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
            !!instituitionsHierarchy
        )
      )
      .subscribe((instituitionsHierarchy: InstituitionHierarchy[]) => {
        if (instituitionsHierarchy.length) {
          const nextLevel = instituitionsHierarchy[0].hierarchyLevel - 1;
          this.createInstitutionFormControl(nextLevel);
          this.hierarchyArray[nextLevel].options = instituitionsHierarchy;
          this.hierarchyArray[nextLevel].shouldDisplay = true;
        } else {
          let finalInstitutionId = this.hierarchyArray[this.hierarchyArray.length - 1].formControl.value;
          this.setFinalHierarchyLevel(finalInstitutionId);
        }
      });
  }

  private setFinalHierarchyLevel(optionId: string): void {
    this.instituitionHierarchyIdFormControl.setValue(optionId);
    this.store.dispatch(new ResetInstitutionHierarchy());
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
        this.store.dispatch(new GetAllByInstitutionAndLevel(this.instituitionIdFormControl.value, 1));
      });
  }

  private createInstitutionFormControl(descriptionIndex: number): void {
    const hierarchyEl = {
      formControl: new FormControl('', Validators.required),
      title: this.institutionFieldDesc[descriptionIndex].title,
      hierarchyLevel: this.institutionFieldDesc[descriptionIndex].hierarchyLevel,
      institutionId: this.institutionFieldDesc[descriptionIndex].institutionId,
      shouldDisplay: false,
      options: [],
    };

    this.hierarchyArray.push(hierarchyEl);
  }

  onHierarchyLevelSelect(optionId: string, hierarchy: HierarchyElement): void {
    this.store.dispatch(new GetInstitutionHierarchyChildrenById(optionId));
    let needToSlice = this.hierarchyArray[this.hierarchyArray.length - 1].hierarchyLevel - hierarchy.hierarchyLevel != 0;
    if (needToSlice) {
      const nextEl = this.hierarchyArray.indexOf(hierarchy) + 1;
      this.hierarchyArray = this.hierarchyArray.slice(0, nextEl);
      this.setFinalHierarchyLevel(null);
    }
    
  }

  setEditMode(): void {
    this.store.dispatch(new GetInstitutionHierarchyParentsById(this.instituitionHierarchyIdFormControl.value));

    this.editInstituitionsHierarchy$
      .pipe(
        takeUntil(this.destroy$),
        filter((instituitionsHierarchy: InstituitionHierarchy[]) => !!instituitionsHierarchy && !!this.hierarchyArray.length)
      )
      .subscribe((instituitionsHierarchy: InstituitionHierarchy[]) => {
        debugger;
        instituitionsHierarchy.forEach((institutionsHierarchy: InstituitionHierarchy) => {
          this.hierarchyArray[institutionsHierarchy.hierarchyLevel - 1].formControl.setValue(
            institutionsHierarchy.id,
            { emitEvent: false }
          );
          this.store.dispatch(new GetInstitutionHierarchyChildrenById(institutionsHierarchy.id));
        });
      });
  }

  ngOnDestroy(): void {
    this.store.dispatch(new ResetInstitutionHierarchy());
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
