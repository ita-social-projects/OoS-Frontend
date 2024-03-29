import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, ValidationErrors } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

import {
  FULL_NAME_REGEX,
  HOUSE_REGEX,
  NAME_REGEX,
  NO_LATIN_REGEX,
  SECTION_NAME_REGEX,
  STREET_REGEX
} from 'shared/constants/regex-constants';

@Component({
  selector: 'app-validation-hint',
  templateUrl: './validation-hint.component.html'
})
export class ValidationHintComponent implements OnInit, OnDestroy, OnChanges {
  @Input() public validationFormControl: FormControl = new FormControl(); // required for validation
  // for Length Validation
  @Input() public minCharacters: number;
  @Input() public maxCharacters: number;
  @Input() public isPhoneNumber: boolean; // required to display validation for phone number
  @Input() public isEdrpouIpn: boolean;

  // for Date Format Validation
  @Input() public minMaxDate: boolean;

  public required: boolean;
  public invalidSymbols: boolean;
  public invalidCharacters: boolean;
  public invalidFieldLength: boolean;
  public invalidDateRange: boolean;
  public invalidDateFormat: boolean;
  public invalidEmail: boolean;
  public invalidEdrpouIpn: boolean;
  public invalidPhoneLength: boolean;
  public invalidStreet: boolean;
  public invalidHouse: boolean;
  public invalidSectionName: boolean;

  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private cdr: ChangeDetectorRef) {}

  public ngOnInit(): void {
    this.validationFormControl.statusChanges.pipe(debounceTime(200), takeUntil(this.destroy$)).subscribe(() => {
      const errors = this.validationFormControl.errors;

      // Makes the control touched, so that the user can see the result of the check without needing to unfocus
      if (!this.validationFormControl.touched) {
        this.validationFormControl.markAsTouched();
      }

      // Check is the field required and empty
      this.required = errors?.required && !this.validationFormControl.value;

      // Check Date Picker Format
      if (this.minMaxDate) {
        this.checkMatDatePicker();
      }

      // Check errors from validators
      this.checkValidationErrors(errors);

      // Check errors for invalid text field
      this.checkInvalidText(errors);

      this.cdr.detectChanges();
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
    this.invalidEmail = errors?.email;
    if (this.isPhoneNumber) {
      this.invalidPhoneLength = errors?.minlength && !errors?.maxlength;
    } else if (this.isEdrpouIpn) {
      this.invalidEdrpouIpn = errors?.minlength && !errors?.maxlength;
    } else {
      this.invalidFieldLength = errors?.maxlength || errors?.minlength;
    }
  }

  private checkInvalidText(errors: ValidationErrors): void {
    const requiredPattern = errors?.pattern?.requiredPattern?.toString();

    this.invalidSymbols = NAME_REGEX.toString() === requiredPattern || FULL_NAME_REGEX.toString() === requiredPattern;
    this.invalidCharacters = NO_LATIN_REGEX.toString() === requiredPattern;
    this.invalidStreet = STREET_REGEX.toString() === requiredPattern;
    this.invalidHouse = HOUSE_REGEX.toString() === requiredPattern;
    this.invalidSectionName = SECTION_NAME_REGEX.toString() === requiredPattern;
  }

  private checkMatDatePicker(): void {
    this.invalidDateFormat = this.validationFormControl.hasError('matDatepickerParse');
    this.invalidDateRange = !!(
      this.validationFormControl.hasError('matDatepickerMin') || this.validationFormControl.hasError('matDatepickerMax')
    );
  }
}
