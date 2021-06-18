import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Child } from 'src/app/shared/models/child.model';
import { Parent } from 'src/app/shared/models/parent.model';
import { SocialGroup } from 'src/app/shared/models/socialGroup.model';
import { ChangePage } from 'src/app/shared/store/app.actions';
import { GetSocialGroup } from 'src/app/shared/store/meta-data.actions';
import { MetaDataState } from 'src/app/shared/store/meta-data.state';
import { RegistrationState } from 'src/app/shared/store/registration.state';
import { CreateChildren } from 'src/app/shared/store/user.actions';

@Component({
  selector: 'app-create-child',
  templateUrl: './create-child.component.html',
  styleUrls: ['./create-child.component.scss']
})
export class CreateChildComponent implements OnInit {

  ChildrenFormArray = new FormArray([]);

  @Select(MetaDataState.socialGroups)
  socialGroups$: Observable<SocialGroup[]>;

  @Select(RegistrationState.parent)
  parent$: Observable<Parent>;

  constructor(private store: Store, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.store.dispatch(new ChangePage(false));
    this.ChildrenFormArray.push(this.newForm());

    this.socialGroups$.subscribe(socialGroups => {
      if (socialGroups.length === 0) {
        this.store.dispatch(new GetSocialGroup())
      }
    })

  }

  /**
  * This method create new FormGroup
  * @param FormArray array
  */
  newForm(): FormGroup {
    const childFormGroup = this.fb.group({
      lastName: new FormControl(''),
      firstName: new FormControl(''),
      middleName: new FormControl(''),
      birthDay: new FormControl(''),
      gender: new FormControl(''),
      socialGroupId: new FormControl(''),
    });

    childFormGroup.get('socialGroupId').valueChanges.subscribe(val =>
      (!val) && childFormGroup.get('socialGroupId').setValue(null)
    );

    return childFormGroup;
  }

  /**
  * This method create new FormGroup add new FormGroup to the FormArray
  */
  addChild() {
    this.ChildrenFormArray.push(this.newForm());
  }

  /**
  * This method delete FormGroup from teh FormArray by index
  * @param index
  */
  onDeleteForm(index): void {
    this.ChildrenFormArray.removeAt(index)
  }

  /**
  * This method create CHild and distpatch CreateChild action
  */
  onSubmit() {
    for (let i = 0; i < this.ChildrenFormArray.controls.length; i++) {
      let child: Child = new Child(this.ChildrenFormArray.controls[i].value);
      this.store.dispatch(new CreateChildren(child))
    }
  }
}
