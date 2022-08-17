import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Address, MapAddress } from 'src/app/shared/models/address.model';
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

  get settlementFormControl(): FormControl {
    return this.searchFormGroup.get('settlement') as FormControl;
  }
  get streetFormControl(): FormControl {
    return this.addressFormGroup.get('street') as FormControl;
  }
  get buildingNumberFormControl(): FormControl {
    return this.addressFormGroup.get('buildingNumber') as FormControl;
  }

  addressFormGroup: FormGroup;
  searchFormGroup: FormGroup;
  mapAddressFormGroup: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.addressFormGroup = this.formBuilder.group({
      street: new FormControl('', FormValidators.defaultAddressValidators),
      buildingNumber: new FormControl('', FormValidators.defaultAddressValidators),
      catottgId: new FormControl('', Validators.required),
    });
    this.searchFormGroup = this.formBuilder.group({
      settlementSearch: new FormControl('', FormValidators.defaultSearchValidators),
      settlement: new FormControl(''),
    });
    this.mapAddressFormGroup = this.formBuilder.group({
      street: this.streetFormControl,
      buildingNumber: this.buildingNumberFormControl,
      codeficatorAddressDto: this.settlementFormControl,
    });
    if (this.address) {
      this.mapAddressFormGroup.patchValue(this.address, { emitEvent: false });
    }
    this.passAddressFormGroup.emit(this.addressFormGroup);
  }

  onSetMapAddress(address: MapAddress): void {
    this.streetFormControl.setValue(address.street);
    this.buildingNumberFormControl.setValue(address.buildingNumber);
    this.searchFormGroup.get('settlementSearch').setValue(address.codeficatorAddressDto.settlement);
  }
}
