import { debounceTime, takeUntil } from 'rxjs/operators';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
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
export class ValidationHintComponent implements OnInit, OnDestroy {
  readonly dateFormPlaceholder = Constants.DATE_FORMAT_PLACEHOLDER;

  @Input() validationFormControl: FormControl; //required for validation

  //for Length Validation
  @Input() minCharachters: number;
  @Input() maxCharachters: number;

  //for Date Format Validation
  @Input() minMaxDate: boolean;

  required: boolean;
  invalid: boolean;
  invalidSymbols: boolean;
  invalidCharacters: boolean;

  invalidLength: boolean;
  invalidDateRange: boolean;
  invalidEmail: boolean;

  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor() {}

  ngOnInit(): void {
    this.validationFormControl.statusChanges.pipe(
      debounceTime(200),
      takeUntil(this.destroy$)
    ).subscribe(()=>{
      const errors = this.validationFormControl.errors;
      //Check is the field valid
      this.invalid = this.validationFormControl.invalid && this.validationFormControl.touched;

      //Check is the field required and empty
      this.required = !!(errors?.required && !this.validationFormControl.value);

      //Check Date Picker Format
      this.minMaxDate && this.checkMatDatePciker();

      //Check errors from validators
      this.checkValidationErrors(errors);

      //Check errors for invalid text field 
      this.checkInvalidText(errors);
    })
  }

  private checkValidationErrors(errors: ValidationErrors): void {
    this.invalidEmail = !!errors?.email;
    this.invalidLength = !!(errors?.maxlength || errors?.minlength);
  }

  private checkInvalidText(errors: ValidationErrors): void {
    const requiredPattern = errors?.pattern?.requiredPattern;

    this.invalidSymbols = NAME_REGEX.test(requiredPattern);
    this.invalidCharacters = NO_LATIN_REGEX.test(requiredPattern);
  }

  private checkMatDatePciker(): void {
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