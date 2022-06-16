import { InstituitionHierarchy } from './../../models/institution.model';
import { Options } from '@angular-slider/ngx-slider';
import { GetFieldDescriptionByInstitutionId, GetAllByInstitutionAndLevel, ResetInstitutionHierarchy } from './../../store/meta-data.actions';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Actions, ofAction, Select, Store } from '@ngxs/store';
import { Provider } from '../../models/provider.model';
import { RegistrationState } from '../../store/registration.state';
import { Institution, InstitutionFieldDescription } from '../../models/institution.model';
import { Observable } from 'rxjs';
import { MetaDataState } from '../../store/meta-data.state';
import { GetAllInstitutions } from '../../store/meta-data.actions';
import { tap, filter, debounceTime } from 'rxjs/operators';
export interface HierarchyElement {
  formControl: FormControl;
  title: string;
  hierarchyLevel: number;
  institutionId: string;
  shouldDisplay: boolean;
  options?: InstituitionHierarchy[];
}
@Component({
  selector: 'app-institution-hierarchy',
  templateUrl: './institution-hierarchy.component.html',
  styleUrls: ['./institution-hierarchy.component.scss'],
})
export class InstitutionHierarchyComponent implements OnInit {
  @Select(MetaDataState.institutions)
  institutions$: Observable<Institution[]>;
  @Select(MetaDataState.institutionFieldDesc)
  institutionFieldDesc$: Observable<InstitutionFieldDescription[]>;
  institutionFieldDesc: InstitutionFieldDescription[];
  @Select(MetaDataState.instituitionsHierarchy)
  instituitionsHierarchy$: Observable<InstituitionHierarchy[]>;
  instituitionsHierarchy: InstituitionHierarchy[];

  hierarchyArray: HierarchyElement[] = [];

  selectedLevel;

  private providerInstitution = this.store.selectSnapshot<Provider>(RegistrationState.provider).institution;

  institutionIdFormControl = new FormControl(this.providerInstitution.id, Validators.required);
  instituitionHierarchyFormControl = new FormControl('', Validators.required);

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch([
      new GetAllInstitutions(),
      new GetFieldDescriptionByInstitutionId(this.providerInstitution.id),
    ]);

    this.instituitionsHierarchy$.pipe(
      filter((instituitionsHierarchy: InstituitionHierarchy[])=>!!instituitionsHierarchy)
    ).subscribe((instituitionsHierarchy: InstituitionHierarchy[])=>{
      this.instituitionsHierarchy = instituitionsHierarchy;
      this.hierarchyArray[instituitionsHierarchy[0].hierarchyLevel-1].options = instituitionsHierarchy; 
    })

    this.institutionFieldDesc$
      .pipe(
        filter((institutionFieldDesc: InstitutionFieldDescription[]) => !!institutionFieldDesc),
        tap((institutionFieldDesc: InstitutionFieldDescription[]) => institutionFieldDesc.sort((a, b) => a.hierarchyLevel - b.hierarchyLevel))
      )
      .subscribe((institutionFieldDesc: InstitutionFieldDescription[]) => {
        this.hierarchyArray = [];
        this.institutionFieldDesc = institutionFieldDesc;
        this.createInstitutionFormGroup();
      });
    this.institutionIdFormControl.valueChanges.subscribe((institutionId: string) => {
      this.store.dispatch([new GetFieldDescriptionByInstitutionId(institutionId)]);
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
        options: []
      };
      this.hierarchyArray.push(hierarchy);
    });
    const firtHierarchyLevel = this.hierarchyArray[0];
    this.store.dispatch(new GetAllByInstitutionAndLevel(firtHierarchyLevel.institutionId, firtHierarchyLevel.hierarchyLevel))
  }

  onHierarchyLevelSelect(hierarchy: HierarchyElement, optionId: string): void {
    this.store.dispatch( new ResetInstitutionHierarchy());
    const currentEl = this.hierarchyArray.indexOf(hierarchy);
    this.store.dispatch( new GetAllByInstitutionAndLevel(hierarchy.institutionId, hierarchy.hierarchyLevel));

    if(this.hierarchyArray[currentEl+1]){
      setTimeout(()=> this.hierarchyArray[currentEl+1].shouldDisplay = true, 500);
    }else{
      const selectedOption = hierarchy.options.find((option: InstituitionHierarchy)=> option.id === optionId);
      this.instituitionHierarchyFormControl.setValue(selectedOption);
    }
  }

  onClick(hierarchy: HierarchyElement): void{
    this.store.dispatch( new GetAllByInstitutionAndLevel(hierarchy.institutionId, hierarchy.hierarchyLevel));
  }
}
