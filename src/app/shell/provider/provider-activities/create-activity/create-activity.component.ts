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

  constructor( private store: Store ) {}
  
  ngOnInit() {}

  onSubmit() {
    
    this.store.dispatch(new CreateWorkshop( 
      this.AboutFormGroup, 
      this.DescriptionFormGroup,
      this.AddressFormGroup,
      this.TeacherFormArray)
      );
  }
  receiveAddressFormGroup ( form ):void{
    this.AddressFormGroup = form;
  }
  receiveTeacherFormArray( array ):void{
    this.TeacherFormArray = array;
  }
  receiveAboutFormGroup ( form ) : void {
    this.AboutFormGroup = form;
  }
  receiveDescriptionFormGroup ( form ) : void {
    this.DescriptionFormGroup = form;
  }
}
