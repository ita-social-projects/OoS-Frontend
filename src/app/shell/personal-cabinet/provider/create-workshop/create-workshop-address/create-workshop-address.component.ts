import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { FormValidators, ValidationConstants } from 'shared/constants/validation';
import { Address } from 'shared/models/address.model';
import { Geocoder } from 'shared/models/geolocation';

@Component({
  selector: 'app-create-workshop-address',
  templateUrl: './create-workshop-address.component.html',
  styleUrls: ['./create-workshop-address.component.scss']
})
export class CreateWorkshopAddressComponent implements OnInit {
  public readonly validationConstants = ValidationConstants;

  @Input() public address: Address;

  @Output() public passAddressFormGroup = new EventEmitter();

  public addressFormGroup: FormGroup;
  public searchFormGroup: FormGroup;
  public noAddressFound = false;

  public get settlementFormControl(): FormControl {
    return this.searchFormGroup.get('settlement') as FormControl;
  }

  public get settlementSearchFormControl(): FormControl {
    return this.searchFormGroup.get('settlementSearch') as FormControl;
  }

  constructor(private formBuilder: FormBuilder) {}

  public ngOnInit(): void {
    this.addressFormGroup = this.formBuilder.group({
      street: new FormControl('', FormValidators.defaultStreetValidators),
      buildingNumber: new FormControl('', FormValidators.defaultHouseValidators),
      catottgId: new FormControl('', Validators.required),
      latitude: new FormControl('', Validators.required),
      longitude: new FormControl('', Validators.required)
    });
    this.searchFormGroup = this.formBuilder.group({
      settlementSearch: new FormControl('', FormValidators.defaultSearchValidators),
      settlement: new FormControl('')
    });

    this.passAddressFormGroup.emit(this.addressFormGroup);
  }

  public onAddressSelect(result: Geocoder): void {
    this.noAddressFound = !result;
    if (result) {
      this.settlementFormControl.setValue(result.codeficator);
      this.settlementSearchFormControl.setValue(result.codeficator.settlement);
    }
  }
}
