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
  //This function iterates over LegalAddress inputs' values and set it to ActualAddress inputs//
  duplicateForm (ob:MatCheckboxChange): boolean {
    this.cd.detectChanges(); //TODO: research change detector for MatCheckbox
    if(ob.checked) {
      objectKeys(this.LegalAddressFormGroup.controls).forEach(key=>{
        this.ActualAddressFormGroup.controls[key].setValue(this.LegalAddressFormGroup.value[key])
      });
    }else{
      objectKeys(this.ActualAddressFormGroup.controls).forEach(key=>{
        this.ActualAddressFormGroup.controls[key].setValue(undefined)
      });
    }
    return ob.checked
  }

  ngOnInit(): void {
    this.passActualAddressFormGroup.emit(this.ActualAddressFormGroup);
    this.passLegalAddressFormGroup.emit(this.LegalAddressFormGroup);
  }
}
