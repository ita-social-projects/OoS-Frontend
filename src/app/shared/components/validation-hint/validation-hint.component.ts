import {
  ChangeDetectionStrategy,
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
import { ValidationParams, PatternMapper, ValidationMessages } from 'shared/constants/validation-messages';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-validation-hint',
  templateUrl: './validation-hint.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
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
    private readonly translateService: TranslateService
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
      this.errors.push(ValidationMessages.REQUIRED_INPUT);
    }

    // Check errors from validators
    this.checkValidationErrors(errors);

    if (this.displayToolTip) {
      this.tooltipText = this.errors.map((message) => this.createMessage(message));
    }

    this.cdr.detectChanges();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes?.isTouched) {
      (this.validationFormControl.statusChanges as EventEmitter<any>).emit();
    }
  }

  public createMessage(message: string): string {
    return this.translateService.instant(message, this.validationParams);
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  private checkValidationErrors(errors: ValidationErrors): void {
    if (!errors) {
      return;
    }

    const requiredPattern = errors?.pattern?.requiredPattern?.toString();

    const matchedMapping = this.patternMapper.find((mapping) => mapping.pattern.toString() === requiredPattern);

    const errorConditions = [
      {
        condition: () => this.isNumberValue && (errors.max || errors.min),
        message: ValidationMessages.INVALID_VALUE
      },
      {
        condition: () => errors.email && !this.errors.includes(ValidationMessages.REQUIRED_INPUT),
        message: ValidationMessages.INVALID_EMAIL
      },
      {
        condition: () => this.minNumberValue,
        message: ValidationMessages.LESS_THAN_PARTICIPANTS
      },
      {
        condition: () => errors.blacklistedDomain,
        message: ValidationMessages.INVALID_EMAIL_TYPE
      },
      {
        condition: () => errors.invalidSearch,
        message: ValidationMessages.INVALID_SEARCH
      },
      {
        condition: () => errors.invalidTimeFormat,
        message: ValidationMessages.INVALID_TIME_FORMAT
      },
      {
        condition: () => this.isPhoneNumber && errors.minlength,
        message: ValidationMessages.INVALID_PHONE_LENGTH
      },
      {
        condition: () => this.isPhoneNumber && !errors.minlength && errors.validatePhoneNumber,
        message: ValidationMessages.INVALID_PHONE_NUMBER
      },
      {
        condition: () => this.isEdrpouIpn && errors.minlength && !errors.maxlength,
        message: ValidationMessages.INVALID_EDRPO_IPN
      },
      {
        condition: () =>
          !this.isPhoneNumber &&
          !this.isEdrpouIpn &&
          (errors.maxlength || errors.minlength) &&
          this.validationParams?.minCharacters &&
          !this.validationParams?.currentCharactersCount,
        message: ValidationMessages.INVALID_LENGTH_FROM_TO
      },
      {
        condition: () =>
          !this.isPhoneNumber &&
          !this.isEdrpouIpn &&
          (errors.maxlength || errors.minlength) &&
          this.validationParams?.minCharacters &&
          this.validationParams?.currentCharactersCount,
        message: ValidationMessages.INVALID_LENGTH_FROM_TO_WITH_COUNT
      },
      {
        condition: () =>
          !this.isPhoneNumber &&
          !this.isEdrpouIpn &&
          (errors.maxlength || errors.minlength) &&
          !this.validationParams?.minCharacters &&
          this.validationParams?.currentCharactersCount,
        message: ValidationMessages.INVALID_LENGTH_NO_MORE_THAN_WITH_COUNT
      },
      {
        condition: () =>
          !this.isPhoneNumber &&
          !this.isEdrpouIpn &&
          (errors.maxlength || errors.minlength) &&
          !this.validationParams?.minCharacters &&
          !this.validationParams?.currentCharactersCount,
        message: ValidationMessages.INVALID_LENGTH_NO_MORE_THAN
      },
      {
        condition: () =>
          this.validationFormControl.hasError(ValidationErrorsEnum.MatDatepickerParse) &&
          this.errors.includes(ValidationMessages.REQUIRED_INPUT),
        message: ValidationMessages.INVALID_DATE_FIELD
      },
      {
        condition: () =>
          this.validationFormControl.hasError(ValidationErrorsEnum.MatDatepickerMin) ||
          this.validationFormControl.hasError(ValidationErrorsEnum.MatDatepickerMax),
        message: ValidationMessages.INVALID_DATE_RANGE
      },
      {
        condition: () => Boolean(matchedMapping),
        message: matchedMapping?.message
      }
    ];

    errorConditions.forEach(({ condition, message }) => {
      if (condition()) {
        this.errors.push(message);
      }
    });

    if (this.errors.includes(ValidationMessages.INVALID_DATE_FIELD)) {
      this.errors = this.errors.filter((error) => error !== ValidationMessages.REQUIRED_INPUT);
    }

    this.cdr.markForCheck();
  }

  private checkFormLevelValidationErrors(errors: ValidationErrors): void {
    if (errors?.invalidAgeRange) {
      this.errors.push(ValidationMessages.INVALID_AGE_RANGE);
    }

    if (errors?.invalidTimeRange) {
      this.errors.push(ValidationMessages.INVALID_TIME_RANGE);
    }

    this.cdr.markForCheck();
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
