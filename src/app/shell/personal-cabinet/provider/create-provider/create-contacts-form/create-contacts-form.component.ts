import { NO_LATIN_REGEX } from 'src/app/shared/constants/regex-constants';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Provider } from 'src/app/shared/models/provider.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ValidationConstants } from 'src/app/shared/constants/validation';
import { City } from 'src/app/shared/models/city.model';
import { Constants } from 'src/app/shared/constants/constants';

const defaultValidators: ValidatorFn[] = [
  Validators.required,
  Validators.pattern(NO_LATIN_REGEX),
  Validators.minLength(ValidationConstants.INPUT_LENGTH_1),
  Validators.maxLength(ValidationConstants.INPUT_LENGTH_60),
];
@Component({
  selector: 'app-create-contacts-form',
  templateUrl: './create-contacts-form.component.html',
  styleUrls: ['./create-contacts-form.component.scss'],
})
export class CreateContactsFormComponent implements OnInit, OnDestroy {
  readonly validationConstants = ValidationConstants;

  ActualAddressFormGroup: FormGroup;
  LegalAddressFormGroup: FormGroup;
  isSameAddressControl: FormControl = new FormControl(false);
  destroy$: Subject<boolean> = new Subject<boolean>();
  cityLegalFormControl = new FormControl('', defaultValidators);
  cityActualFormControl = new FormControl('', defaultValidators);
  cityLegal: string;
  cityActual: string;

  @Input() provider: Provider;
  @Output() passActualAddressFormGroup = new EventEmitter();
  @Output() passLegalAddressFormGroup = new EventEmitter();

  constructor(private formBuilder: FormBuilder) {
    this.LegalAddressFormGroup = this.formBuilder.group({
      street: new FormControl(''),
      buildingNumber: new FormControl(''),
      city: new FormControl(''),
      district: new FormControl(''),
      region: new FormControl(''),
    });

    this.ActualAddressFormGroup = this.formBuilder.group({
      street: new FormControl(''),
      buildingNumber: new FormControl(''),
      city: new FormControl(''),
      district: new FormControl(''),
      region: new FormControl(''),
    });

    this.setDefaultValidators(this.ActualAddressFormGroup);
    this.setDefaultValidators(this.LegalAddressFormGroup);
  }

  ngOnInit(): void {
    this.sameAddressHandler();
    this.provider && this.activateEditMode();
    this.passActualAddressFormGroup.emit(this.ActualAddressFormGroup);
    this.passLegalAddressFormGroup.emit(this.LegalAddressFormGroup);
  }

  onSelectLegalCity(event: any): void {
    this.cityLegal = event.name;
    this.LegalAddressFormGroup.get('city').reset();
    this.LegalAddressFormGroup.get('city').setValue(event.name);
  }

  onSelectActualCity(event: any): void {
    this.cityActual = event.name;
    this.ActualAddressFormGroup.get('city').reset();
    this.ActualAddressFormGroup.get('city').setValue(event.name);
  }

  onFocusOutLegal(city: City): void {
    if (!this.cityLegalFormControl.value || city?.name === Constants.NO_CITY) {
      this.cityLegalFormControl.setValue(null);
    } else {
      this.cityLegalFormControl.setValue(this.cityLegal);
    }
  }

  onFocusOutActual(city: City): void {
    if (!this.cityActualFormControl.value || city?.name === Constants.NO_CITY) {
      this.cityActualFormControl.setValue(null);
    } else {
      this.cityActualFormControl.setValue(this.cityActual);
    }
  }

  private activateEditMode(): void {
    this.cityLegal = this.provider.legalAddress.city;
    this.cityActual = this.provider.actualAddress?.city;
    this.LegalAddressFormGroup.addControl('id', this.formBuilder.control(''));
    this.ActualAddressFormGroup.addControl('id', this.formBuilder.control(''));

    this.LegalAddressFormGroup.patchValue(this.provider.legalAddress, { emitEvent: false });
    this.provider?.actualAddress &&
      this.ActualAddressFormGroup.patchValue(this.provider.actualAddress, { emitEvent: false });

    this.isSameAddressControl.setValue(!Boolean(this.provider.actualAddress));
  }

  /**
   * This method makes input enable if radiobutton value is true and sets the value to the formgroup
   */
  private sameAddressHandler(): void {
    const enable = (reactForm: FormGroup | FormControl) => {
      reactForm.enable();
      reactForm.markAsUntouched();
      this.setDefaultValidators(this.ActualAddressFormGroup);
    };
    const disable = (reactForm: FormGroup | FormControl) => {
      reactForm.reset();
      reactForm.disable();
      reactForm.clearValidators();
    };

    this.isSameAddressControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((isSame: boolean) => {
      if (isSame) {
        disable(this.ActualAddressFormGroup);
        disable(this.cityActualFormControl);
      } else {
        enable(this.ActualAddressFormGroup);
        enable(this.cityActualFormControl);
        this.provider?.actualAddress && this.ActualAddressFormGroup.get('id').setValue(this.provider.actualAddress.id);
      }
    });
  }
  /**
   * This method add validators to teh form-group when actual address is not teh same as legal address
   */
  private setDefaultValidators(form: FormGroup): void {
    Object.keys(form.controls).forEach((formControlTitle: string) => {
      form.get(formControlTitle).setValidators(defaultValidators);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
