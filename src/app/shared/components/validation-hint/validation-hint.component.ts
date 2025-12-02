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
import { AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors } from '@angular/forms';
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
import { Util } from 'shared/utils/utils';

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
  @Input() public isEdrpou: boolean;

  // for Date Format Validation
  @Input() public minMaxDate: boolean;
  @Input() public isCompetitionDate: boolean;

  // For min number validation
  @Input() public minNumberValue: number;

  // For value validation
  @Input() public isNumberValue: boolean;
  @Input() public minValue: number;
  @Input() public maxValue: number;
  @Input() public isAge: boolean;

  // For price validation
  @Input() public isPrice: boolean;

  // For form level validation
  @Input() public formLevelValidation: boolean;

  // For specific study period range validation
  @Input() public errorMessagesMap: Map<string, string> = new Map<string, string>();

  // For images form controls
  @Input() public isImage: boolean;
  @Input() public minImages: number;
  @Input() public maxImages: number;

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
      } else {
        this.checkFormNestingAndUpdateValidation(this.validationFormControl);
      }
    });

    this.translateService.onLangChange.pipe(takeUntil(this.destroy$)).subscribe((event: LangChangeEvent) => {
      this.cdr.markForCheck();
    });
  }

  public checkFormNestingAndUpdateValidation(abstractControl: AbstractControl): void {
    if (abstractControl instanceof FormControl) {
      this.updateValidationState(abstractControl);
    } else if (abstractControl instanceof FormGroup) {
      Object.keys(abstractControl.controls).forEach((controlName) => {
        this.checkFormNestingAndUpdateValidation(abstractControl.get(controlName));
      });
    } else if (abstractControl instanceof FormArray) {
      abstractControl.controls?.forEach((control: AbstractControl) => {
        this.checkFormNestingAndUpdateValidation(control);
      });
    }
  }

  public updateValidationState(control: AbstractControl): void {
    const errors = control.errors;

    // Makes the control touched, so that the user can see the result of the check without needing to unfocus
    if (!control.touched) {
      control.markAsTouched();
    }

    // Check is the field required and empty
    if (errors?.required && Util.isEmpty(control?.value) && !this.errors.includes(ValidationMessages.REQUIRED_INPUT)) {
      this.errors.push(ValidationMessages.REQUIRED_INPUT);
    }

    // Check errors from validators
    this.checkValidationErrors(errors);

    this.applyCustomErrorMessages();

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
        condition: (): boolean => this.isNumberValue && (errors.max || errors.min),
        message: ValidationMessages.INVALID_VALUE
      },
      {
        condition: (): number => this.minNumberValue,
        message: ValidationMessages.LESS_THAN_PARTICIPANTS
      },
      // Email validation
      {
        condition: (): boolean => errors.email && !this.errors.includes(ValidationMessages.REQUIRED_INPUT),
        message: ValidationMessages.INVALID_EMAIL
      },
      {
        condition: (): boolean => errors.blacklistedDomain,
        message: ValidationMessages.INVALID_EMAIL_TYPE
      },
      // min, max price in the filter Validation
      {
        condition: (): boolean => errors.minPriceFilterError,
        message: ValidationMessages.INVALID_MINIMUM_FILTER_PRICE
      },
      {
        condition: (): boolean => errors.maxPriceFilterError,
        message: ValidationMessages.INVALID_MAXIMUM_FILTER_PRICE
      },
      // Phone number validation
      {
        condition: (): boolean => this.isPhoneNumber && errors.minlength,
        message: ValidationMessages.INVALID_PHONE_LENGTH
      },
      {
        condition: (): boolean => this.isPhoneNumber && !errors.minlength && errors.validatePhoneNumber,
        message: ValidationMessages.INVALID_PHONE_NUMBER
      },
      {
        condition: (): boolean => this.isPrice && (errors.max || errors.min),
        message: ValidationMessages.INVALID_PRICE
      },
      // Value length validation
      {
        condition: (): boolean =>
          !this.isPhoneNumber &&
          !this.isEdrpou &&
          (errors.maxlength || errors.minlength) &&
          this.validationParams?.minCharacters &&
          !this.displayCharacterCounter,
        message: ValidationMessages.INVALID_LENGTH_FROM_TO
      },
      {
        condition: (): boolean =>
          !this.isPhoneNumber &&
          !this.isEdrpou &&
          (errors.maxlength || errors.minlength) &&
          this.validationParams?.minCharacters &&
          this.displayCharacterCounter,
        message: ValidationMessages.INVALID_LENGTH_FROM_TO_WITH_COUNT
      },
      {
        condition: (): boolean =>
          !this.isPhoneNumber &&
          !this.isEdrpou &&
          (errors.maxlength || errors.minlength) &&
          !this.validationParams?.minCharacters &&
          this.displayCharacterCounter,
        message: ValidationMessages.INVALID_LENGTH_NO_MORE_THAN_WITH_COUNT
      },
      {
        condition: (): boolean =>
          !this.isPhoneNumber &&
          !this.isEdrpou &&
          (errors.maxlength || errors.minlength) &&
          !this.validationParams?.minCharacters &&
          !this.displayCharacterCounter,
        message: ValidationMessages.INVALID_LENGTH_NO_MORE_THAN
      },
      // DateTimePicker validation
      {
        condition: (): boolean => errors?.matDatepickerParse,
        message: ValidationMessages.INVALID_DATE_FIELD
      },
      {
        condition: (): boolean => errors?.matStartDateInvalid || errors?.matEndDateInvalid,
        message: ValidationMessages.INVALID_DATE_RANGE
      },
      {
        condition: (): boolean => this.isCompetitionDate && (errors?.matDatepickerMin || errors?.matDatepickerMax),
        message: ValidationMessages.INVALID_REGISTRATION_START_END_DATE
      },
      // Validation by RegExp
      {
        condition: (): boolean => requiredPattern === NAME_REGEX.toString(),
        message: ValidationMessages.INVALID_SYMBOLS
      },
      {
        condition: (): boolean => requiredPattern === FULL_NAME_REGEX.toString(),
        message: ValidationMessages.INVALID_SYMBOLS
      },
      {
        condition: (): boolean => requiredPattern === NO_LATIN_REGEX.toString(),
        message: ValidationMessages.INVALID_CHARACTERS
      },
      {
        condition: (): boolean => requiredPattern === STREET_REGEX.toString(),
        message: ValidationMessages.INVALID_STREET
      },
      {
        condition: (): boolean => requiredPattern === HOUSE_REGEX.toString(),
        message: ValidationMessages.INVALID_HOUSE
      },
      {
        condition: (): boolean => requiredPattern === SECTION_NAME_REGEX.toString(),
        message: ValidationMessages.INVALID_SECTION_NAME
      },
      {
        condition: (): boolean => requiredPattern === SOCIAL_NETWORK_LINK_REGEX.toString(),
        message: ValidationMessages.INVALID_LINK
      },
      {
        condition: (): boolean => requiredPattern === MUST_CONTAIN_LETTERS.toString(),
        message: ValidationMessages.MUST_CONTAIN_LETTERS
      },
      // Other validation
      {
        condition: (): boolean => errors.invalidSearch,
        message: ValidationMessages.INVALID_SEARCH
      },
      {
        condition: (): boolean => errors.invalidTimeFormat,
        message: ValidationMessages.INVALID_TIME_FORMAT
      },
      {
        condition: (): boolean => (errors?.minArrayLength || errors?.maxArrayLength) && !this.isImage,
        message: ValidationMessages.INVALID_TAGS_LENGTH
      },
      {
        condition: (): boolean => this.isEdrpou && errors.minlength && !errors.maxlength,
        message: ValidationMessages.INVALID_EDRPOU
      },
      {
        condition: (): boolean => this.isImage && this.minImages < this.maxImages,
        message: ValidationMessages.IMAGE_AMOUNT_SHOULD_BE_FROM_TO
      },
      {
        condition: (): boolean => this.isImage && this.minImages === this.maxImages,
        message: ValidationMessages.IMAGE_AMOUNT_SHOULD_BE
      }
    ];

    errorConditions.forEach(({ condition, message }) => {
      if (condition() && !this.errors.includes(message)) {
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
        condition: (): boolean => this.isAge && errors?.invalidAgeRange,
        message: ValidationMessages.INVALID_AGE_RANGE
      },
      {
        condition: (): boolean => errors?.invalidTimeRange,
        message: ValidationMessages.INVALID_TIME_RANGE
      },
      {
        condition: (): boolean => errors?.invalidDateRange,
        message: ValidationMessages.INVALID_START_END_DATE
      },
      {
        condition: (): boolean => this.isImage && errors?.imageControlError && this.minImages === this.maxImages,
        message: ValidationMessages.IMAGE_AMOUNT_SHOULD_BE
      },
      {
        condition: (): boolean => this.isImage && errors?.imageControlError && this.minImages < this.maxImages,
        message: ValidationMessages.IMAGE_AMOUNT_SHOULD_BE_FROM_TO
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
      minImages: String(this.minImages ?? ''),
      maxImages: String(this.maxImages ?? ''),
      currentCharactersCount: String(this.validationFormControl.value?.length ?? '')
    };
  }

  private applyCustomErrorMessages(): void {
    if (!this.errorMessagesMap) {
      return;
    }
    this.errors = this.errors.map((error) => this.errorMessagesMap.get(error) || error);
  }
}
