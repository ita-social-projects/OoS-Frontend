import { Observable, Subject } from 'rxjs';
import { filter, take, takeUntil, tap } from 'rxjs/operators';

import { Component, Input, OnDestroy, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { AbstractControl, FormControl, Validators } from '@angular/forms';
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
  styleUrls: ['./institution-hierarchy.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InstitutionHierarchyComponent implements OnInit, OnDestroy {
  @Input() public instituitionHierarchyIdFormControl: AbstractControl;
  @Input() public provider: Provider;
  @Input() public instituitionIdFormControl: AbstractControl;

  @Select(MetaDataState.institutions)
  public institutions$: Observable<Institution[]>;
  @Select(MetaDataState.instituitionsHierarchy)
  private readonly instituitionsHierarchy$: Observable<InstituitionHierarchy[]>;
  @Select(MetaDataState.editInstituitionsHierarchy)
  private readonly editInstituitionsHierarchy$: Observable<InstituitionHierarchy[]>;
  @Select(MetaDataState.institutionFieldDesc)
  private readonly institutionFieldDesc$: Observable<InstitutionFieldDescription[]>;

  public hierarchyArray: HierarchyElement[] = [];

  private editInstituitionsHierarchy: InstituitionHierarchy[];
  private institutionFieldDesc: InstitutionFieldDescription[];
  private readonly destroy$: Subject<boolean> = new Subject<boolean>();
  private isEditMode: boolean;

  constructor(
    private readonly store: Store,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {}

  public get instituitionIdControl(): FormControl {
    return this.instituitionIdFormControl as FormControl;
  }

  public ngOnInit(): void {
    this.store.dispatch(new GetAllInstitutions(false));

    this.isEditMode = !!this.instituitionIdFormControl.value;

    this.setInitialInstitution();

    if (this.isEditMode) {
      this.setEditMode();
    } else {
      this.setFieldsDescriptionSubscribe();
    }
  }

  public onHierarchyLevelSelect(hierarchy: HierarchyElement): void {
    const needToSlice = this.hierarchyArray[this.hierarchyArray.length - 1].hierarchyLevel - hierarchy.hierarchyLevel !== 0;

    this.store.dispatch(new GetInstitutionHierarchyChildrenById(hierarchy.formControl.value));

    if (needToSlice) {
      const nextEl = this.hierarchyArray.indexOf(hierarchy) + 1;
      this.hierarchyArray = this.hierarchyArray.slice(0, nextEl);
      this.setFinalHierarchyLevel(null);
    }
    this.changeDetectorRef.markForCheck();
  }

  public ngOnDestroy(): void {
    this.store.dispatch(new ResetInstitutionHierarchy());
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  private setInitialInstitution(): void {
    const institutionId = this.isEditMode ? this.instituitionIdFormControl.value : this.provider.institution?.id;

    if (institutionId) {
      this.instituitionIdFormControl.setValue(institutionId, { emitEvent: false });
      this.store.dispatch(new GetFieldDescriptionByInstitutionId(this.instituitionIdFormControl.value));
    }

    this.setHierarchySubscribes();
  }

  private setHierarchySubscribes(): void {
    this.instituitionIdFormControl.valueChanges.subscribe((institutionId: string) => {
      this.store.dispatch(new GetFieldDescriptionByInstitutionId(institutionId));
      this.changeDetectorRef.markForCheck();
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
        this.changeDetectorRef.markForCheck();
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
    this.changeDetectorRef.markForCheck();
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
      .subscribe((instituitionsHierarchy: InstituitionHierarchy[]) => {
        this.editInstituitionsHierarchy = instituitionsHierarchy;
        this.changeDetectorRef.markForCheck();
      });

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
        this.changeDetectorRef.markForCheck();
      });
  }
}
