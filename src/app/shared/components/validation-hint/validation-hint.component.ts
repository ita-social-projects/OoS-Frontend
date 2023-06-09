import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

import {
  ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, SimpleChanges
} from '@angular/core';
import { FormControl, ValidationErrors } from '@angular/forms';

import { Constants } from '../../constants/constants';
import {
  HOUSE_REGEX, NAME_REGEX, NO_LATIN_REGEX, STREET_REGEX
} from '../../constants/regex-constants';

enum ValidatorsTypes {
  requiredField,
  validLength,
  validTextField
}
@Component({
  selector: 'app-validation-hint',
  templateUrl: './validation-hint.component.html'
})
export class ValidationHintComponent implements OnInit, OnDestroy, OnChanges {
  @Input() public validationFormControl: FormControl = new FormControl(); // required for validation
  // for Length Validation
  @Input() public minCharachters: number;
  @Input() public maxCharachters: number;
  @Input() public isPhoneNumber: number; // required to display validation for phone number

  // for Date Format Validation
  @Input() public minMaxDate: boolean;

  private destroy$: Subject<boolean> = new Subject<boolean>();

  public required: boolean;
  public invalidSymbols: boolean;
  public invalidCharacters: boolean;
  public invalidFieldLength: boolean;
  public invalidDateRange: boolean;
  public invalidDateFormat: boolean;
  public invalidEmail: boolean;
  public invalidPhoneLength: boolean;
  public invalidStreet: boolean;
  public invalidHouse: boolean;

  constructor(private cd: ChangeDetectorRef) {}

  public ngOnInit(): void {
    this.validationFormControl.statusChanges.pipe(debounceTime(200), takeUntil(this.destroy$)).subscribe(() => {
      const errors = this.validationFormControl.errors;
      console.log(errors);

      // Makes the control touched, so that the user can see the result of the check without needing to unfocus
      if (!this.validationFormControl.touched) {
        this.validationFormControl.markAsTouched();
      }

      // Check is the field required and empty
      this.required = !!(errors?.required && !this.validationFormControl.value);

      // Check Date Picker Format
      this.minMaxDate && this.checkMatDatePciker();

      // Check errors from validators
      this.checkValidationErrors(errors);

      // Check errors for invalid text field
      this.checkInvalidText(errors);

      console.log({
        invalidHouse: this.invalidHouse,
        invalidFieldLength: this.invalidFieldLength
      });

      this.cd.detectChanges();
    });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes?.isTouched) {
      (this.validationFormControl.statusChanges as EventEmitter<any>).emit();
    }
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  private checkValidationErrors(errors: ValidationErrors): void {
    this.invalidEmail = !!errors?.email;
    if (this.isPhoneNumber) {
      this.invalidPhoneLength = !!errors?.minlength && !errors?.maxlength;
    } else {
      this.invalidFieldLength = !!(errors?.maxlength || errors?.minlength);
    }
  }

  private checkInvalidText(errors: ValidationErrors): void {
    const requiredPattern = errors?.pattern?.requiredPattern;

    this.invalidSymbols = NAME_REGEX == requiredPattern;
    this.invalidCharacters = NO_LATIN_REGEX == requiredPattern;
    this.invalidStreet = STREET_REGEX == requiredPattern;
    this.invalidHouse = HOUSE_REGEX == requiredPattern;
  }

  private checkMatDatePciker(): void {
    this.invalidDateFormat = this.validationFormControl.hasError('matDatepickerParse');
    this.invalidDateRange = !!(
      this.validationFormControl.hasError('matDatepickerMin') || this.validationFormControl.hasError('matDatepickerMax')
    );
  }
}
