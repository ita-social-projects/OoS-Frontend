import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Provider } from 'src/app/shared/models/provider.model';
import { TEXT_REGEX, TEXT_WITH_DIGITS_REGEX } from 'src/app/shared/constants/regex-constants'
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-create-contacts-form',
  templateUrl: './create-contacts-form.component.html',
  styleUrls: ['./create-contacts-form.component.scss']
})
export class CreateContactsFormComponent implements OnInit, OnDestroy {
  ActualAddressFormGroup: FormGroup;
  LegalAddressFormGroup: FormGroup;
  isSameAddressControl: FormControl = new FormControl(false);
  destroy$: Subject<boolean> = new Subject<boolean>();

  @Input() provider: Provider;
  @Output() passActualAddressFormGroup = new EventEmitter();
  @Output() passLegalAddressFormGroup = new EventEmitter();

  constructor(private formBuilder: FormBuilder) {
    this.LegalAddressFormGroup = this.formBuilder.group({
      street: new FormControl('', [Validators.required, Validators.pattern(TEXT_WITH_DIGITS_REGEX)]),
      buildingNumber: new FormControl('', [Validators.required, Validators.pattern(TEXT_WITH_DIGITS_REGEX)]),
      city: new FormControl('', [Validators.required, Validators.pattern(TEXT_REGEX)]),
      district: new FormControl('', [Validators.required, Validators.pattern(TEXT_REGEX)]),
      region: new FormControl('', [Validators.required, Validators.pattern(TEXT_REGEX)]),
    });

    this.ActualAddressFormGroup = this.formBuilder.group({
      street: new FormControl('', [Validators.required, Validators.pattern(TEXT_WITH_DIGITS_REGEX)]),
      buildingNumber: new FormControl('', [Validators.required, Validators.pattern(TEXT_WITH_DIGITS_REGEX)]),
      city: new FormControl('', [Validators.required, Validators.pattern(TEXT_REGEX)]),
      district: new FormControl('', [Validators.required, Validators.pattern(TEXT_REGEX)]),
      region: new FormControl('', [Validators.required, Validators.pattern(TEXT_REGEX)]),
    });
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
        this.setValidators();
        this.provider?.actualAddress && this.ActualAddressFormGroup.get('id')
          .setValue(this.provider.actualAddress.id);
      }
    });
  }
  /**
  * This method add validators to teh form-group when actual address is not teh same as legal address
  */
  private setValidators(): void {
    const addValidator = (formControlTitle: string) => (formControlTitle === 'buildingNumber' 
      || formControlTitle === 'street') 
      ? Validators.pattern(TEXT_WITH_DIGITS_REGEX) 
      : Validators.pattern(TEXT_REGEX);

    Object.keys(this.ActualAddressFormGroup.controls).forEach((formControlTitle: string) => {
      this.ActualAddressFormGroup.get(formControlTitle)
        .setValidators([addValidator(formControlTitle), Validators.required]);
    });    
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
