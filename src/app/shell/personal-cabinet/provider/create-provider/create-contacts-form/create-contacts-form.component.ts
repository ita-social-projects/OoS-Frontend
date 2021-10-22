import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Provider } from 'src/app/shared/models/provider.model';
import {TEXT_REGEX, BUILDING_NUMBER_REGEX} from 'src/app/shared/constants/regex-constants'

@Component({
  selector: 'app-create-contacts-form',
  templateUrl: './create-contacts-form.component.html',
  styleUrls: ['./create-contacts-form.component.scss']
})
export class CreateContactsFormComponent implements OnInit {
  ActualAddressFormGroup: FormGroup;
  LegalAddressFormGroup: FormGroup;
  isSameAddressControl: FormControl = new FormControl(false);

  @Input() provider: Provider;
  @Output() passActualAddressFormGroup = new EventEmitter();
  @Output() passLegalAddressFormGroup = new EventEmitter();

  constructor(private formBuilder: FormBuilder) {
    this.LegalAddressFormGroup = this.formBuilder.group({
      street: new FormControl('', [Validators.required, Validators.pattern(TEXT_REGEX)]),
      buildingNumber: new FormControl('', [Validators.required, Validators.pattern(BUILDING_NUMBER_REGEX)]),
      city: new FormControl('', [Validators.required, Validators.pattern(TEXT_REGEX)]),
      district: new FormControl('', [Validators.required, Validators.pattern(TEXT_REGEX)]),
      region: new FormControl('', [Validators.required, Validators.pattern(TEXT_REGEX)])
    });

    this.ActualAddressFormGroup = this.formBuilder.group({
      street: new FormControl('', [Validators.required, Validators.pattern(TEXT_REGEX)]),
      buildingNumber: new FormControl('', [Validators.required, Validators.pattern(BUILDING_NUMBER_REGEX)]),
      city: new FormControl('', [Validators.required, Validators.pattern(TEXT_REGEX)]),
      district: new FormControl('', [Validators.required, Validators.pattern(TEXT_REGEX)]),
      region: new FormControl('', [Validators.required, Validators.pattern(TEXT_REGEX)])
    });
  }

  ngOnInit(): void {
    this.passActualAddressFormGroup.emit(this.ActualAddressFormGroup);
    this.passLegalAddressFormGroup.emit(this.LegalAddressFormGroup);
    this.isSameAddressControl.valueChanges.subscribe((isSame: boolean) => {
      (isSame) ? this.ActualAddressFormGroup.patchValue(this.LegalAddressFormGroup.value) : this.ActualAddressFormGroup.reset();
    });

    this.provider && this.activateEditMode();
  }

  activateEditMode(): void {
    this.LegalAddressFormGroup.patchValue(this.provider.legalAddress, { emitEvent: false });

    if (this.provider?.actualAddress) {
      this.ActualAddressFormGroup.patchValue(this.provider.actualAddress, { emitEvent: false });
    } else {
      this.ActualAddressFormGroup.patchValue(this.provider.legalAddress, { emitEvent: false });
    }

  }
}
