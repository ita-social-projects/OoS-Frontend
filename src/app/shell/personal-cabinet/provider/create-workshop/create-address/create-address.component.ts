import { NO_LATIN_REGEX } from 'src/app/shared/constants/regex-constants';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Address } from 'src/app/shared/models/address.model';
import { City } from 'src/app/shared/models/city.model';
import { ValidationConstants } from 'src/app/shared/constants/validation';
import { Constants } from 'src/app/shared/constants/constants';

const defaultValidators: ValidatorFn[] = [
  Validators.required, 
  Validators.pattern(NO_LATIN_REGEX),
  Validators.minLength(ValidationConstants.INPUT_LENGTH_1),
  Validators.maxLength(ValidationConstants.INPUT_LENGTH_60)
];
@Component({
  selector: 'app-create-address',
  templateUrl: './create-address.component.html',
  styleUrls: ['./create-address.component.scss']
})
export class CreateAddressComponent implements OnInit {
  readonly validationConstants = ValidationConstants;

  @Input() address: Address;
  @Output() passAddressFormGroup = new EventEmitter();

  AddressFormGroup: FormGroup;
  city: string = '';
  cityFormControl = new FormControl('', defaultValidators);

  constructor(
    private formBuilder: FormBuilder) {
    this.AddressFormGroup = this.formBuilder.group({
      street: new FormControl('', defaultValidators),
      buildingNumber: new FormControl('', defaultValidators),
      city: this.cityFormControl,
      longitude: new FormControl(''),
      latitude: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.passAddressFormGroup.emit(this.AddressFormGroup);
    if(this.address){
      this.city = this.address.city;
      this.AddressFormGroup.patchValue(this.address, { emitEvent: false });
    }
  }

  onSelectedCity(event: any): void {
    this.city = event.name;
    this.AddressFormGroup.reset();
    this.AddressFormGroup.get('latitude').setValue(event.latitude, { emitEvent: false });
    this.AddressFormGroup.get('longitude').setValue(event.longitude, { emitEvent: false });
    this.AddressFormGroup.get('city').setValue(event.name,  { emitEvent: false });
  }

  onReceiveAddressFromMap(address: Address): void {
    this.city = address.city;
    this.AddressFormGroup.patchValue(address);
  }

  onFocusout(city: City): void {
    if(!this.cityFormControl.value || city.name === Constants.NO_CITY){
      this.cityFormControl.setValue(null);
    } else{
      this.cityFormControl.setValue(this.city);
    }
  }
}
