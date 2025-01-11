import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

import {
  FULL_NAME_REGEX,
  HOUSE_REGEX,
  NAME_REGEX,
  NO_LATIN_REGEX,
  SECTION_NAME_REGEX,
  STREET_REGEX,
  MUST_CONTAIN_LETTERS
} from 'shared/constants/regex-constants';

@Component({
  selector: 'app-validation-hint',
  templateUrl: './validation-hint.component.html'
})
export class ValidationHintComponent implements OnInit, OnDestroy, OnChanges {
  @Input() public validationFormControl: FormControl | FormGroup; // required for validation
  // for Length Validation
  @Input() public minCharacters: number;
  @Input() public maxCharacters: number;
  @Input() public isPhoneNumber: boolean; // required to display validation for phone number
  @Input() public isEdrpouIpn: boolean;
  @Input() public isSearchBar: boolean = false;

  // for Date Format Validation
  @Input() public minMaxDate: boolean;

  // For min number validation
  @Input() public minNumberValue: number;

  // For form level validation
  @Input() public formLevelValidation: boolean;

  public required: boolean;
  public invalidSymbols: boolean;
  public invalidCharacters: boolean;
  public invalidFieldLength: boolean;
  public invalidDateRange: boolean;
  public invalidDateFormat: boolean;
  public invalidEmail: boolean;
  public invalidEdrpouIpn: boolean;
  public invalidPhoneLength: boolean;
  public invalidPhoneNumber: boolean;
  public invalidStreet: boolean;
  public invalidHouse: boolean;
  public invalidSectionName: boolean;
  public mustContainLetters: boolean;
  public invalidSearch: boolean;
  public invalidTimeFormat: boolean;
  public invalidTimeRange: boolean;

  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private cdr: ChangeDetectorRef) {}

  public ngOnInit(): void {
    this.validationFormControl.statusChanges.pipe(debounceTime(200), takeUntil(this.destroy$)).subscribe(() => {
      if (this.formLevelValidation) {
        this.checkFormLevelValidationErrors(this.validationFormControl.errors);
      } else if (this.validationFormControl instanceof FormGroup) {
        Object.keys(this.validationFormControl.controls).forEach((key) => {
          this.updateValidationState(this.validationFormControl.get(key) as FormControl);
        });
      } else {
        this.updateValidationState(this.validationFormControl as FormControl);
      }
    });
  }

  public updateValidationState(formControl: FormControl): void {
    const errors = formControl.errors;

    // Makes the control touched, so that the user can see the result of the check without needing to unfocus
    if (!formControl.touched) {
      formControl.markAsTouched();
    }

    // Check is the field required and empty
    if (!this.isSearchBar) {
      this.required = errors?.required && !formControl.value;
    }

    // Check Date Picker Format
    if (this.minMaxDate) {
      this.checkMatDatePicker();
    }

    // Check errors from validators
    this.checkValidationErrors(errors);

    // Check errors for invalid text field
    this.checkInvalidText(errors);

    this.cdr.detectChanges();
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
      this.invalidPhoneLength = errors?.minlength;
      this.invalidPhoneNumber = !this.invalidPhoneLength && errors?.validatePhoneNumber;
    } else if (this.isEdrpouIpn) {
      this.invalidEdrpouIpn = errors?.minlength && !errors?.maxlength;
    } else if (this.isSearchBar) {
      this.invalidSearch = errors?.length !== 0;
    } else {
      this.invalidFieldLength = errors?.maxlength || errors?.minlength;
    }
    this.invalidTimeFormat = errors?.invalidTimeFormat;
  }

  private checkFormLevelValidationErrors(errors: ValidationErrors): void {
    this.invalidTimeRange = errors?.invalidTimeRange;
  }

  private checkInvalidText(errors: ValidationErrors): void {
    const requiredPattern = errors?.pattern?.requiredPattern?.toString();

    this.invalidSymbols = NAME_REGEX.toString() === requiredPattern || FULL_NAME_REGEX.toString() === requiredPattern;
    this.invalidCharacters = NO_LATIN_REGEX.toString() === requiredPattern;
    this.invalidStreet = STREET_REGEX.toString() === requiredPattern;
    this.invalidHouse = HOUSE_REGEX.toString() === requiredPattern;
    this.invalidSectionName = SECTION_NAME_REGEX.toString() === requiredPattern;
    this.mustContainLetters = MUST_CONTAIN_LETTERS.toString() === requiredPattern;
  }

  private checkMatDatePicker(): void {
    this.invalidDateFormat = this.validationFormControl.hasError('matDatepickerParse');
    this.invalidDateRange =
      this.validationFormControl.hasError('matDatepickerMin') || this.validationFormControl.hasError('matDatepickerMax');
  }
}
