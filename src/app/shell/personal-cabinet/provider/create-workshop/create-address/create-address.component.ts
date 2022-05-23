import { NO_LATIN_REGEX } from 'src/app/shared/constants/regex-constants';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Address } from 'src/app/shared/models/address.model';
import { City } from 'src/app/shared/models/city.model';
import { MetaDataState } from 'src/app/shared/store/meta-data.state';
import { ValidationConstants } from 'src/app/shared/constants/validation';

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
  city: string;

  @Select(MetaDataState.cities)
  cities$: Observable<City[]>;

  constructor(
    private formBuilder: FormBuilder) {
    this.AddressFormGroup = this.formBuilder.group({
      street: new FormControl('', defaultValidators),
      buildingNumber: new FormControl('', defaultValidators),
      city: new FormControl('', defaultValidators),
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
