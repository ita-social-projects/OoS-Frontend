import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Address } from 'src/app/shared/models/address.model';
import { FormValidators, ValidationConstants } from 'src/app/shared/constants/validation';

@Component({
  selector: 'app-create-workshop-address',
  templateUrl: './create-workshop-address.component.html',
  styleUrls: ['./create-workshop-address.component.scss'],
})
export class CreateWorkshopAddressComponent implements OnInit {
  readonly validationConstants = ValidationConstants;

  @Input() address: Address;
  @Output() passAddressFormGroup = new EventEmitter();

  addressFormGroup: FormGroup;
  searchFormGroup: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.addressFormGroup = this.formBuilder.group({
      street: new FormControl('', FormValidators.defaultAddressValidators),
      buildingNumber: new FormControl('', FormValidators.defaultAddressValidators),
      catottgId: new FormControl('', Validators.required),
    });
    this.searchFormGroup = this.formBuilder.group({
      settlementSearch: new FormControl('', FormValidators.defaultSearchValidators),
      settlement: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.passAddressFormGroup.emit(this.addressFormGroup);
  }
}
