import { Geocoder } from './../../../../../shared/models/geolocation';
import { Codeficator } from './../../../../../shared/models/codeficator.model';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
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

  addressFormGroup: UntypedFormGroup;
  searchFormGroup: UntypedFormGroup;
  noAddressFound = false;

  get settlementFormControl(): UntypedFormControl {
    return this.searchFormGroup.get('settlement') as UntypedFormControl;
  }

  get settlementSearchFormControl(): UntypedFormControl {
    return this.searchFormGroup.get('settlementSearch') as UntypedFormControl;
  }

  constructor(private formBuilder: UntypedFormBuilder) {}

  ngOnInit(): void {
    this.addressFormGroup = this.formBuilder.group({
      street: new UntypedFormControl('', FormValidators.defaultAddressValidators),
      buildingNumber: new UntypedFormControl('', FormValidators.defaultAddressValidators),
      catottgId: new UntypedFormControl('', Validators.required),
      latitude: new UntypedFormControl(''),
      longitude: new UntypedFormControl(''),
    });
    this.searchFormGroup = this.formBuilder.group({
      settlementSearch: new UntypedFormControl('', FormValidators.defaultSearchValidators),
      settlement: new UntypedFormControl(''),
    });

    this.addressFormGroup.valueChanges.subscribe(val => console.log(val))
    this.passAddressFormGroup.emit(this.addressFormGroup);
  }

  onAddressSelect(result: Geocoder): void {
    this.noAddressFound = !result;
    if (result) {
      this.settlementFormControl.setValue(result.codeficator);
      this.settlementSearchFormControl.setValue(result.codeficator.settlement);
    } else {
      this.searchFormGroup.reset();
    }
  }
}
