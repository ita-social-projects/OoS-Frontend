import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { FormControl, FormGroup, ValidationErrors } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { ValidationErrorsEnum } from 'shared/enum/validation-errors';
import { ValidationParams, PatternMapper } from 'shared/constants/validation-messages';
import { ValidationMessageService } from 'shared/services/validation-message/validation-message.service';

@Component({
  selector: 'app-validation-hint',
  templateUrl: './validation-hint.component.html'
})
export class ValidationHintComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('validationHint', { read: ElementRef }) public validationHint: ElementRef;
  @Input() public validationFormControl: FormControl | FormGroup; // required for validation
  // for Length Validation
  @Input() public minCharacters: number;
  @Input() public maxCharacters: number;
  @Input() public currentCharactersCount: number;
  @Input() public isPhoneNumber: boolean; // required to display validation for phone number
  @Input() public isEdrpouIpn: boolean;

  // for Date Format Validation
  @Input() public minMaxDate: boolean;

  // For min number validation
  @Input() public minNumberValue: number;

  // For value validation
  @Input() public isNumberValue: boolean;
  @Input() public minValue: number;
  @Input() public maxValue: number;

  // For form level validation
  @Input() public formLevelValidation: boolean;

  @Input() public displayToolTip: boolean;
  public tooltipText: string[] = [];
  public errors: string[] = [];
  public validationParams: ValidationParams;
  public patternMapper = PatternMapper;

  private readonly destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly validationMessageService: ValidationMessageService
  ) {}

  public ngOnInit(): void {
    this.validationFormControl.statusChanges.pipe(debounceTime(1), takeUntil(this.destroy$)).subscribe(() => {
      this.setValidationParams();
      this.errors = [];
      if (this.formLevelValidation) {
        this.checkFormLevelValidationErrors(this.validationFormControl.errors);
      } else if (this.validationFormControl instanceof FormGroup) {
        Object.keys(this.validationFormControl.controls).forEach((key) => {
          this.updateValidationState(this.validationFormControl.get(key) as FormControl);
        });
      } else {
        this.updateValidationState(this.validationFormControl);
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
    if (errors?.required && !formControl?.value) {
      this.errors.push(ValidationErrorsEnum.Required);
    }

    if (this.minMaxDate) {
      this.checkMatDatePicker();
    }

    // Check errors from validators
    this.checkValidationErrors(errors);

    // Check errors for invalid text field
    this.checkInvalidText(errors);

    if (this.displayToolTip) {
      this.tooltipText = this.errors.map((errorKey) => this.validationMessageService.getMessage(errorKey, this.validationParams));
    }

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
    if (!errors) {
      return;
    }
    const errorConditions = [
      {
        condition: () => this.isNumberValue && (errors.max || errors.min),
        errorKey: ValidationErrorsEnum.InvalidValue
      },
      {
        condition: () => errors.email && !this.errors.includes(ValidationErrorsEnum.Required),
        errorKey: ValidationErrorsEnum.InvalidEmail
      },
      {
        condition: () => this.minNumberValue,
        errorKey: ValidationErrorsEnum.MinNumberValue
      },
      {
        condition: () => errors.blacklistedDomain,
        errorKey: ValidationErrorsEnum.InvalidEmailType
      },
      {
        condition: () => errors.invalidSearch,
        errorKey: ValidationErrorsEnum.InvalidSearch
      },
      {
        condition: () => errors.invalidTimeFormat,
        errorKey: ValidationErrorsEnum.InvalidTimeFormat
      },
      {
        condition: () => this.isPhoneNumber && errors.minlength,
        errorKey: ValidationErrorsEnum.InvalidPhoneLength
      },
      {
        condition: () => this.isPhoneNumber && !errors.minlength && errors.validatePhoneNumber,
        errorKey: ValidationErrorsEnum.InvalidPhoneNumber
      },
      {
        condition: () => this.isEdrpouIpn && errors.minlength && !errors.maxlength,
        errorKey: ValidationErrorsEnum.InvalidEdrpouIpn
      },
      {
        condition: () => !this.isPhoneNumber && !this.isEdrpouIpn && (errors.maxlength || errors.minlength),
        errorKey: ValidationErrorsEnum.InvalidFieldLength
      }
    ];

    errorConditions.forEach(({ condition, errorKey }) => {
      if (condition()) {
        this.errors.push(errorKey);
      }
    });

    this.cdr.markForCheck();
  }

  private checkFormLevelValidationErrors(errors: ValidationErrors): void {
    if (errors?.invalidAgeRange) {
      this.errors.push(ValidationErrorsEnum.InvalidAgeRange);
    }

    if (errors?.invalidTimeRange) {
      this.errors.push(ValidationErrorsEnum.InvalidTimeRange);
    }

    this.cdr.markForCheck();
  }

  private checkInvalidText(errors: ValidationErrors): void {
    const requiredPattern = errors?.pattern?.requiredPattern?.toString();
    if (!requiredPattern) {
      return;
    }

    const matchedMapping = this.patternMapper.find((mapping) => mapping.pattern.toString() === requiredPattern);

    if (matchedMapping) {
      this.errors.push(matchedMapping.errorKey);
    }
  }

  private checkMatDatePicker(): void {
    if (
      this.validationFormControl.hasError(ValidationErrorsEnum.MatDatepickerParse) &&
      this.errors.includes(ValidationErrorsEnum.Required)
    ) {
      this.errors = this.errors.filter((error) => error !== ValidationErrorsEnum.Required);
      this.errors.push(ValidationErrorsEnum.IncorrectDateField);
    }
    if (
      this.validationFormControl.hasError(ValidationErrorsEnum.MatDatepickerMin) ||
      this.validationFormControl.hasError(ValidationErrorsEnum.MatDatepickerMax)
    ) {
      this.errors.push(ValidationErrorsEnum.InvalidDateRange);
    }
  }

  private setValidationParams(): void {
    this.validationParams = {
      minCharacters: String(this.minCharacters ?? ''),
      maxCharacters: String(this.maxCharacters ?? ''),
      minValue: String(this.minValue ?? ''),
      maxValue: String(this.maxValue ?? ''),
      currentCharactersCount: String(this.currentCharactersCount ?? '')
    };
  }
}
