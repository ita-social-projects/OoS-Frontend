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
import { AbstractControl, FormControl, FormGroup, ValidationErrors } from '@angular/forms';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { ValidationMessages, ValidationParams } from 'shared/enum/validation-messages';
import {
  FULL_NAME_REGEX,
  HOUSE_REGEX,
  MUST_CONTAIN_LETTERS,
  NAME_REGEX,
  NO_LATIN_REGEX,
  SECTION_NAME_REGEX,
  SOCIAL_NETWORK_LINK_REGEX,
  STREET_REGEX
} from 'shared/constants/regex-constants';

@Component({
  selector: 'app-validation-hint',
  templateUrl: './validation-hint.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ValidationHintComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('validationHint', { read: ElementRef }) public validationHint: ElementRef;
  @Input() public validationFormControl: AbstractControl; // required for validation
  // for Length Validation
  @Input() public minCharacters: number;
  @Input() public maxCharacters: number;
  @Input() public displayCharacterCounter: boolean;
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

  // For price validation
  @Input() public isPrice: boolean;

  // For form level validation
  @Input() public formLevelValidation: boolean;

  @Input() public displayToolTip: boolean;
  public tooltipText: string[] = [];
  public errors: string[] = [];
  public validationParams: ValidationParams;

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

    this.translateService.onLangChange.pipe(takeUntil(this.destroy$)).subscribe((event: LangChangeEvent) => {
      this.cdr.markForCheck();
    });
  }

  public updateValidationState(control: AbstractControl): void {
    const errors = control.errors;

    // Makes the control touched, so that the user can see the result of the check without needing to unfocus
    if (!control.touched) {
      control.markAsTouched();
    }

    // Check is the field required and empty
    if (errors?.required && !control?.value) {
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

    const requiredPattern = errors?.pattern?.requiredPattern.toString();

    const errorConditions = [
      // Number validation
      {
        condition: () => this.isNumberValue && (errors.max || errors.min),
        message: ValidationMessages.INVALID_VALUE
      },
      {
        condition: () => this.minNumberValue,
        message: ValidationMessages.LESS_THAN_PARTICIPANTS
      },
      // Email validation
      {
        condition: () => errors.email && !this.errors.includes(ValidationMessages.REQUIRED_INPUT),
        message: ValidationMessages.INVALID_EMAIL
      },
      {
        condition: () => errors.blacklistedDomain,
        message: ValidationMessages.INVALID_EMAIL_TYPE
      },
      // Phone number validation
      {
        condition: () => this.isPhoneNumber && errors.minlength,
        message: ValidationMessages.INVALID_PHONE_LENGTH
      },
      {
        condition: () => this.isPhoneNumber && !errors.minlength && errors.validatePhoneNumber,
        message: ValidationMessages.INVALID_PHONE_NUMBER
      },
      {
        condition: () => this.isPrice && (errors.max || errors.min),
        message: ValidationMessages.INVALID_PRICE
      },
      // Value length validation
      {
        condition: () =>
          !this.isPhoneNumber &&
          !this.isEdrpouIpn &&
          (errors.maxlength || errors.minlength) &&
          this.validationParams?.minCharacters &&
          !this.displayCharacterCounter,
        message: ValidationMessages.INVALID_LENGTH_FROM_TO
      },
      {
        condition: () =>
          !this.isPhoneNumber &&
          !this.isEdrpouIpn &&
          (errors.maxlength || errors.minlength) &&
          this.validationParams?.minCharacters &&
          this.displayCharacterCounter,
        message: ValidationMessages.INVALID_LENGTH_FROM_TO_WITH_COUNT
      },
      {
        condition: () =>
          !this.isPhoneNumber &&
          !this.isEdrpouIpn &&
          (errors.maxlength || errors.minlength) &&
          !this.validationParams?.minCharacters &&
          this.displayCharacterCounter,
        message: ValidationMessages.INVALID_LENGTH_NO_MORE_THAN_WITH_COUNT
      },
      {
        condition: () =>
          !this.isPhoneNumber &&
          !this.isEdrpouIpn &&
          (errors.maxlength || errors.minlength) &&
          !this.validationParams?.minCharacters &&
          !this.displayCharacterCounter,
        message: ValidationMessages.INVALID_LENGTH_NO_MORE_THAN
      },
      // DateTimePicker validation
      {
        condition: () => this.validationFormControl.errors?.matDatepickerParse && this.errors.includes(ValidationMessages.REQUIRED_INPUT),
        message: ValidationMessages.INVALID_DATE_FIELD
      },
      {
        condition: () => this.validationFormControl.errors?.matDatepickerMin || this.validationFormControl.errors?.matDatepickerMax,
        message: ValidationMessages.INVALID_DATE_RANGE
      },
      // Validation by RegExp
      {
        condition: () => requiredPattern === NAME_REGEX.toString(),
        message: ValidationMessages.INVALID_SYMBOLS
      },
      {
        condition: () => requiredPattern === FULL_NAME_REGEX.toString(),
        message: ValidationMessages.INVALID_SYMBOLS
      },
      {
        condition: () => requiredPattern === NO_LATIN_REGEX.toString(),
        message: ValidationMessages.INVALID_CHARACTERS
      },
      {
        condition: () => requiredPattern === STREET_REGEX.toString(),
        message: ValidationMessages.INVALID_STREET
      },
      {
        condition: () => requiredPattern === HOUSE_REGEX.toString(),
        message: ValidationMessages.INVALID_HOUSE
      },
      {
        condition: () => requiredPattern === SECTION_NAME_REGEX.toString(),
        message: ValidationMessages.INVALID_SECTION_NAME
      },
      {
        condition: () => requiredPattern === SOCIAL_NETWORK_LINK_REGEX.toString(),
        message: ValidationMessages.INVALID_LINK
      },
      {
        condition: () => requiredPattern === MUST_CONTAIN_LETTERS.toString(),
        message: ValidationMessages.MUST_CONTAIN_LETTERS
      },
      // Other validation
      {
        condition: () => errors.invalidSearch,
        message: ValidationMessages.INVALID_SEARCH
      },
      {
        condition: () => errors.invalidTimeFormat,
        message: ValidationMessages.INVALID_TIME_FORMAT
      },
      {
        condition: () => errors?.minArrayLength || errors?.maxArrayLength,
        message: ValidationMessages.INVALID_TAGS_LENGTH
      },
      {
        condition: () => this.isEdrpouIpn && errors.minlength && !errors.maxlength,
        message: ValidationMessages.INVALID_EDRPO_IPN
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
    const errorConditions = [
      {
        condition: () => errors?.invalidAgeRange,
        message: ValidationMessages.INVALID_AGE_RANGE
      },
      {
        condition: () => errors?.invalidTimeRange,
        message: ValidationMessages.INVALID_TIME_RANGE
      }
    ];

    errorConditions.forEach(({ condition, message }) => {
      if (condition()) {
        this.errors.push(message);
      }
    });

    this.cdr.markForCheck();
  }

  private setValidationParams(): void {
    this.validationParams = {
      minCharacters: String(this.minCharacters ?? ''),
      maxCharacters: String(this.maxCharacters ?? ''),
      minValue: String(this.minValue ?? ''),
      maxValue: String(this.maxValue ?? ''),
      currentCharactersCount: String(this.validationFormControl.value?.length ?? '')
    };
  }
}
