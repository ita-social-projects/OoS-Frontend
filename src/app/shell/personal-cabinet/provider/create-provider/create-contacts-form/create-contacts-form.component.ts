import { NO_LATIN_REGEX } from 'src/app/shared/constants/regex-constants';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Provider } from 'src/app/shared/models/provider.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ValidationConstants } from 'src/app/shared/constants/validation';

const defaultValidators: ValidatorFn[] = [
  Validators.required, 
  Validators.pattern(NO_LATIN_REGEX),
  Validators.minLength(ValidationConstants.INPUT_LENGTH_1),
  Validators.maxLength(ValidationConstants.INPUT_LENGTH_60)
]
@Component({
  selector: 'app-create-contacts-form',
  templateUrl: './create-contacts-form.component.html',
  styleUrls: ['./create-contacts-form.component.scss']
})
export class CreateContactsFormComponent implements OnInit, OnDestroy {
  readonly validationConstants = ValidationConstants;
  
  ActualAddressFormGroup: FormGroup;
  LegalAddressFormGroup: FormGroup;
  isSameAddressControl: FormControl = new FormControl(false);
  destroy$: Subject<boolean> = new Subject<boolean>();

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

  private activateEditMode(): void {
    this.LegalAddressFormGroup.addControl('id', this.formBuilder.control(''));
    this.ActualAddressFormGroup.addControl('id', this.formBuilder.control(''));

    this.LegalAddressFormGroup.patchValue(this.provider.legalAddress, { emitEvent: false });
    this.provider?.actualAddress && this.ActualAddressFormGroup.patchValue(this.provider.actualAddress, { emitEvent: false });

    this.isSameAddressControl.setValue(!Boolean(this.provider.actualAddress));
  }

  /**
   * This method makes input enable if radiobutton value is true and sets the value to the formgroup
   */
  private sameAddressHandler(): void {
    this.isSameAddressControl.valueChanges.pipe(
      takeUntil(this.destroy$),
    ).subscribe((isSame: boolean) => {
      if (isSame) {
        this.ActualAddressFormGroup.reset();
        this.ActualAddressFormGroup.disable();
        this.ActualAddressFormGroup.clearValidators();
      } else {
        this.ActualAddressFormGroup.enable();
        this.ActualAddressFormGroup.markAsUntouched();
        this.setDefaultValidators(this.ActualAddressFormGroup); 
        this.provider?.actualAddress && this.ActualAddressFormGroup.get('id')
          .setValue(this.provider.actualAddress.id);
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
