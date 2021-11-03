import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Provider } from 'src/app/shared/models/provider.model';
import { TEXT_REGEX, TEXT_WITH_DIGITS_REGEX } from 'src/app/shared/constants/regex-constants'

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
      buildingNumber: new FormControl('', [Validators.required, Validators.pattern(TEXT_WITH_DIGITS_REGEX)]),
      city: new FormControl('', [Validators.required, Validators.pattern(TEXT_REGEX)]),
      district: new FormControl('', [Validators.required, Validators.pattern(TEXT_REGEX)]),
      region: new FormControl('', [Validators.required, Validators.pattern(TEXT_REGEX)]),
    });

    this.ActualAddressFormGroup = this.formBuilder.group({
      street: new FormControl('', [Validators.required, Validators.pattern(TEXT_REGEX)]),
      buildingNumber: new FormControl('', [Validators.required, Validators.pattern(TEXT_WITH_DIGITS_REGEX)]),
      city: new FormControl('', [Validators.required, Validators.pattern(TEXT_REGEX)]),
      district: new FormControl('', [Validators.required, Validators.pattern(TEXT_REGEX)]),
      region: new FormControl('', [Validators.required, Validators.pattern(TEXT_REGEX)]),
    });
  }

  ngOnInit(): void {
    this.passActualAddressFormGroup.emit(this.ActualAddressFormGroup);
    this.passLegalAddressFormGroup.emit(this.LegalAddressFormGroup);
    this.initDisableIsSameAddressControl();

    this.provider && this.activateEditMode();
  }

  activateEditMode(): void {
    this.LegalAddressFormGroup.addControl('id', this.formBuilder.control(''));
    this.ActualAddressFormGroup.addControl('id', this.formBuilder.control(''));

    this.isSameAddressControl.setValue(!Boolean(this.provider.actualAddress));

    this.LegalAddressFormGroup.patchValue(this.provider.legalAddress, { emitEvent: false });
    this.provider.actualAddress && this.ActualAddressFormGroup.patchValue(this.provider.actualAddress, { emitEvent: false });
  }

  /**
   * This method makes input enable if radiobutton value is true and sets the value to the formgroup
   */
  initDisableIsSameAddressControl(): void {
    this.isSameAddressControl.valueChanges.subscribe((isSame: boolean) => {
      if (isSame) {
        this.ActualAddressFormGroup.reset();
        this.ActualAddressFormGroup.disable();
        this.ActualAddressFormGroup.clearValidators();
      } else {
        this.ActualAddressFormGroup.enable();
        this.ActualAddressFormGroup.markAsUntouched();
        this.setValidators();
      }
    });
  }
  /**
  * This method add validators to teh form-group when actual address is not teh same as legal address
  */
  setValidators(): void {
    const addValidator = (formControlTitle: string) => (formControlTitle !== 'buildingNumber') ? Validators.pattern(TEXT_REGEX) : Validators.pattern(TEXT_WITH_DIGITS_REGEX);

    Object.keys(this.ActualAddressFormGroup.controls).forEach((formControlTitle: string) => {
      this.ActualAddressFormGroup.get(formControlTitle).setValidators([addValidator(formControlTitle), Validators.required]);
    });
  }
}
