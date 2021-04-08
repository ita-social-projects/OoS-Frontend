import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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

  constructor( private store: Store,
      ) {}
  
  ngOnInit() {}

  onSubmit() {
    this.store.dispatch(new CreateWorkshop( 
      this.AboutFormGroup, 
      this.DescriptionFormGroup,
      this.AddressFormGroup,
      this.TeacherFormArray)
    );
  }
  onReceiveAddressFormGroup ( form ):void{
    this.AddressFormGroup = form;
  }
  onReceiveTeacherFormArray( array ):void{
    this.TeacherFormArray = array;
  }
  onReceiveAboutFormGroup ( form ) : void {
    this.AboutFormGroup = form;
  }
  onReceiveDescriptionFormGroup( form ) : void {
    this.DescriptionFormGroup = form;
  }
}
