import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-contacts-form',
  templateUrl: './create-contacts-form.component.html',
  styleUrls: ['./create-contacts-form.component.scss']
})
export class CreateContactsFormComponent implements OnInit {
  ActualAddressFormGroup: FormGroup;
  LegalAddressFormGroup: FormGroup;

  @Output() passActualAddressFormGroup = new EventEmitter();
  @Output() passLegalAddressFormGroup = new EventEmitter();

  constructor(private formBuilder: FormBuilder) {

    this.ActualAddressFormGroup = this.formBuilder.group({
      street: new FormControl('', Validators.required),
      buildingNumber: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      district: new FormControl('', Validators.required),
      region: new FormControl('', Validators.required)
    });
    this.LegalAddressFormGroup = this.formBuilder.group({
      street: new FormControl('', Validators.required),
      buildingNumber: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      district: new FormControl('', Validators.required),
      region: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
    this.passActualAddressFormGroup.emit(this.ActualAddressFormGroup);
    this.passLegalAddressFormGroup.emit(this.LegalAddressFormGroup);
  }
}
