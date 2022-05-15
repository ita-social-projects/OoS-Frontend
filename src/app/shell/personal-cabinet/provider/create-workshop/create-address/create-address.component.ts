import { NO_LATIN_REGEX, NAME_REGEX } from 'src/app/shared/constants/regex-constants';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Address } from 'src/app/shared/models/address.model';
import { City } from 'src/app/shared/models/city.model';
import { MetaDataState } from 'src/app/shared/store/meta-data.state';
import { ValidationConstants } from 'src/app/shared/constants/validation';

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
  city: string;

  @Select(MetaDataState.cities)
  cities$: Observable<City[]>;

  constructor(
    private formBuilder: FormBuilder) {
    this.AddressFormGroup = this.formBuilder.group({
      street: new FormControl('', [
        Validators.required, 
        Validators.pattern(NO_LATIN_REGEX),
        Validators.minLength(ValidationConstants.INPUT_LENGTH_1),
        Validators.maxLength(ValidationConstants.INPUT_LENGTH_30)
      ]),
      buildingNumber: new FormControl('', [
        Validators.required, 
        Validators.pattern(NO_LATIN_REGEX),
        Validators.minLength(ValidationConstants.INPUT_LENGTH_1),
        Validators.maxLength(ValidationConstants.INPUT_LENGTH_15)
      ]),
      city: new FormControl('', [
        Validators.required,
        Validators.pattern(NO_LATIN_REGEX),
        Validators.minLength(ValidationConstants.INPUT_LENGTH_1),
        Validators.maxLength(ValidationConstants.INPUT_LENGTH_15)
      ]),
      longitude: new FormControl(''),
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
    this.AddressFormGroup.get('latitude').setValue(event.latitude);
    this.AddressFormGroup.get('longitude').setValue(event.longitude);
    this.AddressFormGroup.get('city').setValue(event.name);
  }

  onReceiveAddressFromMap(address: Address): void {
    this.city = address.city;
    this.AddressFormGroup.patchValue(address);
  }
}
