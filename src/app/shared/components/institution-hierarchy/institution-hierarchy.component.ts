import { HierarchyElement, InstituitionHierarchy } from './../../models/institution.model';
import {
  GetFieldDescriptionByInstitutionId,
  GetAllByInstitutionAndLevel,
  ResetInstitutionHierarchy,
  GetInstitutionHierarchyChildrenById,
  GetInstitutionHierarchyParentsById,
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
  institutionFormControl: FormControl;
  private providerInstitution: Institution;
  private editMode: boolean; 
 

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.editMode = !!this.instituitionHierarchyIdFormControl.value;
    if(this.editMode){
      this.setEditMode();
    }else{
      // this.setProviderIstitution();
    }
    this.createInstitutioHierarchy();

    this.instituitionsHierarchy$
      .pipe(
        takeUntil(this.destroy$),
        filter((instituitionsHierarchy: InstituitionHierarchy[]) => !!instituitionsHierarchy))
      .subscribe((instituitionsHierarchy: InstituitionHierarchy[]) => {
        const nextLevel = instituitionsHierarchy[0].hierarchyLevel - 1;
        this.hierarchyArray[nextLevel].options = instituitionsHierarchy;
        this.hierarchyArray[nextLevel].shouldDisplay = true;
      });

  }
  private setEditMode(): void {
    const InitialHierarchyArray = [];
    this.store.dispatch(new GetInstitutionHierarchyParentsById(this.instituitionHierarchyIdFormControl.value));
    this.editInstituitionsHierarchy$.subscribe((instituitionsHierarchy: InstituitionHierarchy[])=>{
      if(instituitionsHierarchy[0].hierarchyLevel !== 1){
        this.store.dispatch(new GetFieldDescriptionByInstitutionId(instituitionsHierarchy[0].institutionId)); //add filed instittuion to workshop
      }
    })
  }

  private setProviderIstitution(): void {
    this.providerInstitution = this.store.selectSnapshot<Provider>(RegistrationState.provider).institution;
    this.institutionFormControl =  new FormControl(this.providerInstitution, Validators.required);
    this.institutionFormControl.valueChanges.subscribe((institution: Institution) => {
      this.store.dispatch(new GetFieldDescriptionByInstitutionId(institution.id));
    });
    this.store.dispatch(new GetAllInstitutions());
  }

  private createInstitutioHierarchy(): void {
    this.institutionFieldDesc$
      .pipe(
        takeUntil(this.destroy$),
        filter((institutionFieldDesc: InstitutionFieldDescription[]) => !!institutionFieldDesc),
        tap((institutionFieldDesc: InstitutionFieldDescription[]) => institutionFieldDesc.sort((a, b) => a.hierarchyLevel - b.hierarchyLevel))
      )
      .subscribe((institutionFieldDesc: InstitutionFieldDescription[]) => {
        this.hierarchyArray = [];
        this.institutionFieldDesc = institutionFieldDesc;
        this.createInstitutionFormGroup();
      });
  }

  private createInstitutionFormGroup(): void {
    this.institutionFieldDesc.forEach((institutionFieldDesc: InstitutionFieldDescription) => {
      this.hierarchyArray.push(this.createSingleHierarchyElement(institutionFieldDesc));
    });
    this.store.dispatch(new GetAllByInstitutionAndLevel(this.institutionFormControl.value.id, 1));
  }

  private createSingleHierarchyElement(institutionFieldDesc: InstitutionFieldDescription, options?: InstituitionHierarchy[]): HierarchyElement {
    const hierarchy = {
      formControl: new FormControl('', Validators.required),
      title: institutionFieldDesc.title,
      hierarchyLevel: institutionFieldDesc.hierarchyLevel,
      institutionId: institutionFieldDesc.institutionId,
      shouldDisplay: institutionFieldDesc.hierarchyLevel === 1,
      options,
    };

    hierarchy.formControl.statusChanges.pipe(
      filter(()=> !hierarchy.formControl.touched),
      takeUntil(this.destroy$)
    ).subscribe(()=> hierarchy.formControl.markAsTouched());

    return hierarchy;
  }

  onHierarchyLevelSelect(optionId: string, hierarchy: HierarchyElement): void {
    const currentEl = this.hierarchyArray.indexOf(hierarchy);
    if (this.hierarchyArray[currentEl + 1]) {
      this.store.dispatch([
        new ResetInstitutionHierarchy(), 
        new GetInstitutionHierarchyChildrenById(optionId)
      ]);
    } else {
      this.instituitionHierarchyIdFormControl.setValue(optionId);
    }
  }

  onFocusOut(hierarchy: HierarchyElement): void {
    if(!hierarchy.formControl.value) {
      (<EventEmitter<any>>hierarchy.formControl.statusChanges).emit();
    }
  }

  compareInstitutions(institution1: Institution, institution2: Institution): boolean {
    return institution1.id === institution2.id;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
