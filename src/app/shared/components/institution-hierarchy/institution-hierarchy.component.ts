import { HierarchyElement, InstituitionHierarchy } from './../../models/institution.model';
import {
  GetFieldDescriptionByInstitutionId,
  GetAllByInstitutionAndLevel,
  ResetInstitutionHierarchy,
  GetInstitutionHierarchyChildrenById,
} from './../../store/meta-data.actions';
import { FormControl, Validators } from '@angular/forms';
import { Component, EventEmitter, Input, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Provider } from '../../models/provider.model';
import { RegistrationState } from '../../store/registration.state';
import { Institution, InstitutionFieldDescription } from '../../models/institution.model';
import { Observable, Subject } from 'rxjs';
import { MetaDataState } from '../../store/meta-data.state';
import { GetAllInstitutions } from '../../store/meta-data.actions';
import { tap, filter, takeUntil, debounceTime } from 'rxjs/operators';
import { StringMapWithRename } from '@angular/compiler/src/compiler_facade_interface';
@Component({
  selector: 'app-institution-hierarchy',
  templateUrl: './institution-hierarchy.component.html',
  styleUrls: ['./institution-hierarchy.component.scss'],
})
export class InstitutionHierarchyComponent implements OnInit, OnDestroy {
  @Input() instituitionHierarchyIdFormControl: FormControl;
  @Input() instituitionIdFormControl: FormControl;

  @Select(MetaDataState.institutions)
  institutions$: Observable<Institution[]>;
  @Select(MetaDataState.instituitionsHierarchy)
  instituitionsHierarchy$: Observable<InstituitionHierarchy[]>;
  @Select(MetaDataState.institutionFieldDesc)
  institutionFieldDesc$: Observable<InstitutionFieldDescription[]>;
  institutionFieldDesc: InstitutionFieldDescription[];

  destroy$: Subject<boolean> = new Subject<boolean>();
  hierarchyArray: HierarchyElement[] = [];
  institutionFormControl: FormControl;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.setInitialInstitution();
    
    this.instituitionsHierarchy$
      .pipe(
        takeUntil(this.destroy$),
        filter((instituitionsHierarchy: InstituitionHierarchy[]) => !!instituitionsHierarchy)
      )
      .subscribe((instituitionsHierarchy: InstituitionHierarchy[]) => {
        const nextLevel = instituitionsHierarchy[0].hierarchyLevel - 1;
        this.hierarchyArray[nextLevel].options = instituitionsHierarchy;
        this.hierarchyArray[nextLevel].shouldDisplay = true;
      });

    this.createInstitutioHierarchy();
  }

  setInitialInstitution(): void {
    const institutionId = this.instituitionIdFormControl.value ?
      this.instituitionIdFormControl.value
      :this.store.selectSnapshot<Provider>(RegistrationState.provider).institution.id

    this.institutionFormControl = new FormControl(institutionId, Validators.required);

    this.institutionFormControl.valueChanges.subscribe((institution: Institution) => {
      this.store.dispatch(new GetFieldDescriptionByInstitutionId(institution.id));
    });

    this.store.dispatch([
      new GetAllInstitutions(),
      new GetFieldDescriptionByInstitutionId(this.instituitionIdFormControl.value),
    ]);
  }

  createInstitutioHierarchy(): void {
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
    this.store.dispatch(new GetAllByInstitutionAndLevel(this.institutionFormControl.value.id, 1));
  }

  onHierarchyLevelSelect(optionId: string, hierarchy: HierarchyElement): void {
    const currentEl = this.hierarchyArray.indexOf(hierarchy);
    if (this.hierarchyArray[currentEl + 1]) {
      this.store.dispatch([new ResetInstitutionHierarchy(), new GetInstitutionHierarchyChildrenById(optionId)]);
    } else {
      this.instituitionHierarchyIdFormControl.setValue(optionId);
    }
  }

  compareInstitutions(institution1: Institution, institution2: Institution): boolean {
    return institution1.id === institution2.id;
  }

  ngOnDestroy(): void {
    this.store.dispatch(new ResetInstitutionHierarchy());
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
