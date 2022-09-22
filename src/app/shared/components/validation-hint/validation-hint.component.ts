import { debounceTime, takeUntil } from 'rxjs/operators';
import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';
import { FormControl, ValidationErrors } from '@angular/forms';
import { Subject } from 'rxjs';
import { Constants } from '../../constants/constants';
import { NAME_REGEX, NO_LATIN_REGEX } from '../../constants/regex-constants';

enum ValidatorsTypes {
  requiredField,
  validLength,
  validTextField
}
@Component({
  selector: 'app-validation-hint',
  templateUrl: './validation-hint.component.html',
})
export class ValidationHintComponent implements OnInit, OnDestroy, OnChanges {
  readonly dateFormPlaceholder = Constants.DATE_FORMAT_PLACEHOLDER;

  @Input() validationFormControl: FormControl = new FormControl(); // required for validation
  @Input() isTouched: boolean; // required for dropdowns that doesn't touched
  // for Length Validation
  @Input() minCharachters: number;
  @Input() maxCharachters: number;
  @Input() isPhoneNumber: number; // required to display validation for phone number

  // for Date Format Validation
  @Input() minMaxDate: boolean;

  required: boolean;
  invalid: boolean;
  invalidSymbols: boolean;
  invalidCharacters: boolean;
  invalidFieldLength: boolean;
  invalidDateRange: boolean;
  invalidDateFormat: boolean;
  invalidEmail: boolean;
  invalidPhoneLength: boolean;

  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor() {}

  ngOnInit(): void {
    this.validationFormControl.statusChanges.pipe(
      debounceTime(200),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      const errors = this.validationFormControl.errors;
      // Check is the field valid
      this.invalid = this.validationFormControl.invalid && this.validationFormControl.touched;

      // Check is the field required and empty
      this.required = !!(errors?.required && !this.validationFormControl.value);

      // Check Date Picker Format
      this.minMaxDate && this.checkMatDatePciker();

      // Check errors from validators
      this.checkValidationErrors(errors);

      // Check errors for invalid text field
      this.checkInvalidText(errors);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.isTouched) {
      (this.validationFormControl.statusChanges as EventEmitter<any>).emit();
    }
  }

  private checkValidationErrors(errors: ValidationErrors): void {
    this.invalidEmail = !!errors?.email;
    if (this.isPhoneNumber){
      this.invalidPhoneLength = !!errors?.minlength && !errors?.maxlength;
    }else{
      this.invalidFieldLength = !!(errors?.maxlength || errors?.minlength);
    }
  }

  private checkInvalidText(errors: ValidationErrors): void {
    const requiredPattern = errors?.pattern?.requiredPattern;

    if (requiredPattern){
      this.invalidSymbols = NAME_REGEX == requiredPattern;
      this.invalidCharacters = NO_LATIN_REGEX == requiredPattern;
    }
  }

  private checkMatDatePciker(): void {
    this.invalidDateFormat = this.validationFormControl.hasError('matDatepickerParse');
    this.invalidDateRange = !!(
        this.validationFormControl.hasError('matDatepickerMin') ||
        this.validationFormControl.hasError('matDatepickerMax')
      );
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
