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
      street: new FormControl(''),
      buildingNumber: new FormControl(''),
      city: new FormControl(''),
      district: new FormControl(''),
      region: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.passActualAddressFormGroup.emit(this.ActualAddressFormGroup);
    this.passLegalAddressFormGroup.emit(this.LegalAddressFormGroup);
    this.onDisableIsSameAddressControlInit();

    this.provider && this.activateEditMode();
  }

  activateEditMode(): void {
    this.LegalAddressFormGroup.patchValue(this.provider.legalAddress, { emitEvent: false });
    this.isSameAddressControl.setValue(!Boolean(this.provider.actualAddress));
    this.provider.actualAddress && this.ActualAddressFormGroup.patchValue(this.provider.actualAddress, { emitEvent: false });
  }

  /**
   * This method makes input enable if radiobutton value is true and sets the value to teh formgroup
   */
  onDisableIsSameAddressControlInit(): void {
    this.isSameAddressControl.valueChanges.subscribe((isSame: boolean) => {
      this.ActualAddressFormGroup.reset();
      if (isSame) {
        this.ActualAddressFormGroup.disable();
        this.ActualAddressFormGroup.clearValidators();
      } else {
        this.ActualAddressFormGroup.enable();
        this.ActualAddressFormGroup.setValidators([Validators.required, Validators.pattern(TEXT_REGEX)]);
      }
    });
  }
}
