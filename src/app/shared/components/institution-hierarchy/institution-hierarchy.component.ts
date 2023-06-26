import { Observable, Subject } from 'rxjs';
import { filter, switchMap, take, takeUntil, tap } from 'rxjs/operators';

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';

import { HierarchyElement, InstituitionHierarchy, Institution, InstitutionFieldDescription } from '../../models/institution.model';
import { Provider } from '../../models/provider.model';
import {
  GetAllByInstitutionAndLevel,
  GetAllInstitutions,
  GetFieldDescriptionByInstitutionId,
  GetInstitutionHierarchyChildrenById,
  GetInstitutionHierarchyParentsById,
  ResetInstitutionHierarchy
} from '../../store/meta-data.actions';
import { MetaDataState } from '../../store/meta-data.state';

@Component({
  selector: 'app-institution-hierarchy',
  templateUrl: './institution-hierarchy.component.html',
  styleUrls: ['./institution-hierarchy.component.scss']
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
  editInstituitionsHierarchy: InstituitionHierarchy[];
  @Select(MetaDataState.institutionFieldDesc)
  institutionFieldDesc$: Observable<InstitutionFieldDescription[]>;
  institutionFieldDesc: InstitutionFieldDescription[];

  destroy$: Subject<boolean> = new Subject<boolean>();
  hierarchyArray: HierarchyElement[] = [];
  private editMode: boolean;

  constructor(private store: Store) {}

  public ngOnInit(): void {
    this.store.dispatch(new GetAllInstitutions(false));

    this.editMode = !!this.instituitionIdFormControl.value;

    this.setInitialInstitution();

    if (this.editMode) {
      this.setEditMode();
    } else {
      this.setFieldsDescriptionSubscribe();
    }
  }

  public onHierarchyLevelSelect(hierarchy: HierarchyElement): void {
    const needToSlice = this.hierarchyArray[this.hierarchyArray.length - 1].hierarchyLevel - hierarchy.hierarchyLevel != 0;

    this.store.dispatch(new GetInstitutionHierarchyChildrenById(hierarchy.formControl.value));

    if (needToSlice) {
      const nextEl = this.hierarchyArray.indexOf(hierarchy) + 1;
      this.hierarchyArray = this.hierarchyArray.slice(0, nextEl);
      this.setFinalHierarchyLevel(null);
    }
  }

  public ngOnDestroy(): void {
    this.store.dispatch(new ResetInstitutionHierarchy());
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  private setInitialInstitution(): void {
    const institutionId = this.editMode ? this.instituitionIdFormControl.value : this.provider.institution?.id;

    if (institutionId) {
      this.instituitionIdFormControl.setValue(institutionId, { emitEvent: false });
      this.store.dispatch(new GetFieldDescriptionByInstitutionId(this.instituitionIdFormControl.value));
    }

    this.setHierarchySubscribes();
  }

  private setHierarchySubscribes(): void {
    this.instituitionIdFormControl.valueChanges.subscribe((institutionId: string) => {
      this.store.dispatch(new GetFieldDescriptionByInstitutionId(institutionId));
    });

    this.instituitionsHierarchy$
      .pipe(
        takeUntil(this.destroy$),
        filter((instituitionsHierarchy: InstituitionHierarchy[]) => !!instituitionsHierarchy)
      )
      .subscribe((instituitionsHierarchy: InstituitionHierarchy[]) => {
        if (instituitionsHierarchy.length) {
          const newHierarchyElementIndex = this.hierarchyArray.length;
          const newHierarchyElement = this.createHierachyElement(newHierarchyElementIndex);

          this.hierarchyArray.push(newHierarchyElement);
          this.hierarchyArray[newHierarchyElementIndex].options = instituitionsHierarchy;
          this.hierarchyArray[newHierarchyElementIndex].shouldDisplay = true;

          if (this.editInstituitionsHierarchy && this.editInstituitionsHierarchy[newHierarchyElementIndex]) {
            const nextEditInstitution = this.editInstituitionsHierarchy[newHierarchyElementIndex];

            this.store.dispatch(new GetInstitutionHierarchyChildrenById(nextEditInstitution.id));
            this.hierarchyArray[newHierarchyElementIndex].formControl.setValue(
              this.editInstituitionsHierarchy[newHierarchyElementIndex].id,
              { emitEvent: false }
            );
          }
        } else {
          const finalInstitutionId = this.hierarchyArray[this.hierarchyArray.length - 1].formControl.value;
          this.setFinalHierarchyLevel(finalInstitutionId);
          this.editInstituitionsHierarchy = null;
        }
      });
  }

  private createHierachyElement(descriptionIndex: number): HierarchyElement {
    return {
      formControl: new FormControl('', Validators.required),
      title: this.institutionFieldDesc[descriptionIndex].title,
      hierarchyLevel: this.institutionFieldDesc[descriptionIndex].hierarchyLevel,
      institutionId: this.institutionFieldDesc[descriptionIndex].institutionId,
      shouldDisplay: false,
      options: []
    };
  }

  private setFinalHierarchyLevel(optionId: string): void {
    this.instituitionHierarchyIdFormControl.setValue(optionId, { emitEvent: false });
    this.store.dispatch(new ResetInstitutionHierarchy());
  }

  private setEditMode(): void {
    this.store.dispatch(new GetInstitutionHierarchyParentsById(this.instituitionHierarchyIdFormControl.value));

    this.setEditModeSubscribes();
  }

  private setEditModeSubscribes(): void {
    this.editInstituitionsHierarchy$
      .pipe(
        takeUntil(this.destroy$),
        filter((instituitionsHierarchy: InstituitionHierarchy[]) => !!instituitionsHierarchy),
        tap((instituitionsHierarchy: InstituitionHierarchy[]) => instituitionsHierarchy.sort((a, b) => a.hierarchyLevel - b.hierarchyLevel))
      )
      .subscribe((instituitionsHierarchy: InstituitionHierarchy[]) => (this.editInstituitionsHierarchy = instituitionsHierarchy));

    // Subscribes to institutionFieldDesc$ only after receiving 1 editInstitutionsHierarchy$ result
    this.editInstituitionsHierarchy$
      .pipe(
        filter((instituitionsHierarchy: InstituitionHierarchy[]) => !!instituitionsHierarchy),
        take(1)
      )
      .subscribe(() => this.setFieldsDescriptionSubscribe());
  }

  private setFieldsDescriptionSubscribe(): void {
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
        this.setFinalHierarchyLevel(null);
      });
  }
}
