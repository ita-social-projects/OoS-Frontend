import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { Store } from '@ngxs/store';
import { CreateWorkshop } from '../../../../shared/store/provider.actions';
@Component({
  selector: 'app-create-activity',
  templateUrl: './create-activity.component.html',
  styleUrls: ['./create-activity.component.scss']
})
export class CreateActivityComponent implements OnInit {

  AboutFormGroup: FormGroup;
  DescriptionFormGroup: FormGroup;
  AddressFormGroup: FormGroup;
  TeacherFormArray: FormArray;

  constructor(private store: Store) {

  }

  ngOnInit() {
  }

  /**
   * This method dispatch store action to create a Workshop with Form Groups values
   */
  onSubmit() {
    this.store.dispatch(new CreateWorkshop(
      this.AboutFormGroup,
      this.DescriptionFormGroup,
      this.AddressFormGroup,
      this.TeacherFormArray)
    );
  }
  /**
   * This method receives a from from create-address child component and assigns to the Address FormGroup
   * @param FormGroup form
   */
  onReceiveAddressFormGroup(form: FormGroup): void {
    this.AddressFormGroup = form;
  }
  /**
   * This method receives an array of forms from create-teachers child component and assigns to the Teacher FormArray
   * @param FormArray array
   */
  onReceiveTeacherFormArray(array: FormArray): void {
    this.TeacherFormArray = array;
  }
  /**
   * This method receives  a from from create-about child component and assigns to the About FormGroup
   * @param FormGroup form
   */
  onReceiveAboutFormGroup(form: FormGroup): void {
    this.AboutFormGroup = form;
  }
  /**
   * This method receives a from create-description child component and assigns to the Description FormGroup
   * @param FormGroup form
   */
  onReceiveDescriptionFormGroup(form: FormGroup): void {
    this.DescriptionFormGroup = form;
  }
}
