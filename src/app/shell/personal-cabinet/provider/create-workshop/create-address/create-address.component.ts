import { NO_LATIN_REGEX } from 'src/app/shared/constants/regex-constants';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Address } from 'src/app/shared/models/address.model';
import { ValidationConstants } from 'src/app/shared/constants/validation';

const defaultValidators: ValidatorFn[] = [
  Validators.required,
  Validators.pattern(NO_LATIN_REGEX),
  Validators.minLength(ValidationConstants.INPUT_LENGTH_1),
  Validators.maxLength(ValidationConstants.INPUT_LENGTH_60),
];

const defaultSearchValidators: ValidatorFn[] = [
  Validators.required,
  Validators.pattern(NO_LATIN_REGEX),
  Validators.minLength(ValidationConstants.INPUT_LENGTH_3),
  Validators.maxLength(ValidationConstants.INPUT_LENGTH_60),
];
@Component({
  selector: 'app-create-address',
  templateUrl: './create-address.component.html',
  styleUrls: ['./create-address.component.scss'],
})
export class CreateAddressComponent implements OnInit {
  readonly validationConstants = ValidationConstants;

  @Input() address: Address;
  @Output() passAddressFormGroup = new EventEmitter();

  addressFormGroup: FormGroup;
  searchFormGroup: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.addressFormGroup = this.formBuilder.group({
      street: new FormControl('', defaultValidators),
      buildingNumber: new FormControl('', defaultValidators),
      catottgId: new FormControl('', Validators.required),
    });
    this.searchFormGroup = this.formBuilder.group({
      settlementSearch: new FormControl('', defaultSearchValidators),
      settlement: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.passAddressFormGroup.emit(this.addressFormGroup);
  }
}
