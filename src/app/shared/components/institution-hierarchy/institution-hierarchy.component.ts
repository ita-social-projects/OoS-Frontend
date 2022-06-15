import { InstituitionHierarchy } from './../../models/institution.model';
import { Options } from '@angular-slider/ngx-slider';
import { GetFieldDescriptionByInstitutionId, GetAllByInstitutionAndLevel } from './../../store/meta-data.actions';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Actions, ofAction, Select, Store } from '@ngxs/store';
import { Provider } from '../../models/provider.model';
import { RegistrationState } from '../../store/registration.state';
import { Institution, InstitutionFieldDescription } from '../../models/institution.model';
import { Observable } from 'rxjs';
import { MetaDataState } from '../../store/meta-data.state';
import { GetAllInstitutions } from '../../store/meta-data.actions';
import { tap, filter } from 'rxjs/operators';

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

  hierarchyArray: {
    formControl: FormControl;
    title: string;
    hierarchyLevel: number;
    institutionId: string;
    options,
  }[] = [];

  selectedLevel;

  private providerInstitution = this.store.selectSnapshot<Provider>(RegistrationState.provider).institution;

  institutionIdFormControl = new FormControl(this.providerInstitution.id, Validators.required);

  constructor(private store: Store, private actions$: Actions) {}

  ngOnInit(): void {
    this.store.dispatch([
      new GetAllInstitutions(),
      new GetFieldDescriptionByInstitutionId(this.providerInstitution.id),
    ]);

    this.instituitionsHierarchy$.pipe(
      filter((instituitionsHierarchy: InstituitionHierarchy[])=>!!instituitionsHierarchy)
    ).subscribe((instituitionsHierarchy: InstituitionHierarchy[])=>{
      this.hierarchyArray[instituitionsHierarchy[0].hierarchyLevel].options = instituitionsHierarchy 
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
        institutionId: institutionFieldDesc.id,
        options: []
      };
      this.hierarchyArray.push(hierarchy);
    });
    this.onHierarchyLevelSelect(this.institutionIdFormControl.value, 1)
  }

  onHierarchyLevelSelect(id: string, hierarchyLevel: number): void {
    this.store.dispatch(new GetAllByInstitutionAndLevel(id, hierarchyLevel));
    

    // .subscribe((res)=>{
    //   console.log(res)
    //   this.hierarchyArray[hierarchyLevel-1].options = res;
    //   console.log(this.hierarchyArray)
    // });
    // this.selectedLevel = hierarchy.hierarchyLevel;
    // console.log(this.selectedLevel)
    // console.log(hierarchy.hierarchyLevel)
  }
}
