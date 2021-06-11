import {ChangeDetectorRef, Component, EventEmitter, OnInit, Output} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {MatCheckboxChange} from "@angular/material/checkbox";
import {objectKeys} from "codelyzer/util/objectKeys";


@Component({
  selector: 'app-create-contacts-form',
  templateUrl: './create-contacts-form.component.html',
  styleUrls: ['./create-contacts-form.component.scss']
})
export class CreateContactsFormComponent implements OnInit {
  ActualAddressFormGroup: FormGroup;
  LegalAddressFormGroup: FormGroup;
  useLegalAddress = false;


  @Output() passActualAddressFormGroup = new EventEmitter();
  @Output() passLegalAddressFormGroup = new EventEmitter();

  constructor(private formBuilder: FormBuilder, private cd:ChangeDetectorRef) {

    this.LegalAddressFormGroup = this.formBuilder.group({
      street: new FormControl('', Validators.required),
      buildingNumber: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      district: new FormControl('', Validators.required),
      region: new FormControl('', Validators.required)
    });

    this.ActualAddressFormGroup = this.formBuilder.group({
      street: new FormControl('', Validators.required),
      buildingNumber: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      district: new FormControl('', Validators.required),
      region: new FormControl('', Validators.required)
    });
  }


  duplicateForm(ob:MatCheckboxChange) {
    this.cd.detectChanges()
    console.log(this.useLegalAddress)
    if(ob.checked === true) {
      objectKeys(this.LegalAddressFormGroup.controls).forEach(key=>{
        this.ActualAddressFormGroup.controls[key].setValue(this.LegalAddressFormGroup.value[key])
      });
    }else{
      objectKeys(this.ActualAddressFormGroup.controls).forEach(key=>{
        this.ActualAddressFormGroup.controls[key].setValue(undefined)
      });
    }
  }


  ngOnInit(): void {
    this.passActualAddressFormGroup.emit(this.ActualAddressFormGroup);
    this.passLegalAddressFormGroup.emit(this.LegalAddressFormGroup);
    /*this.isSameAddressControl.valueChanges.subscribe((val)=>{
      console.log(val)
    })*/
  }
}
