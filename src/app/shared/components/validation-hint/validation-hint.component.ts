import {
  AfterViewInit,
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
export class ValidationHintComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {
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
  public invalidValue: boolean;
  public invalidTimeFormat: boolean;
  public invalidTimeRange: boolean;
  public invalidTagsLength: boolean;
  public invalidAgeRange: boolean;
  public invalidEmailType: boolean;
  public tooltipText: string = '';
  private mutationObserver: MutationObserver | null = null;

  private readonly destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private readonly cdr: ChangeDetectorRef) {}

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

  public ngAfterViewInit(): void {
    if (!this.validationHint?.nativeElement) {
      return;
    }

    if (this.displayToolTip) {
      const element = this.validationHint.nativeElement;
      this.mutationObserver = new MutationObserver(() => {
        const text = element.textContent;
        this.tooltipText = text;
        this.cdr.markForCheck();
      });

      this.mutationObserver.observe(element, {
        childList: true,
        subtree: true,
        characterData: true
      });
    }
  }

  public updateValidationState(formControl: FormControl): void {
    const errors = formControl.errors;

    // Makes the control touched, so that the user can see the result of the check without needing to unfocus
    if (!formControl.touched) {
      formControl.markAsTouched();
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
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
      this.mutationObserver = null;
    }
  }

  private checkValidationErrors(errors: ValidationErrors): void {
    if (this.isNumberValue) {
      this.invalidValue = errors?.max || errors?.min;
    }

    this.invalidEmail = errors?.email;
    this.invalidEmailType = errors?.blacklistedDomain;
    this.invalidSearch = errors?.invalidSearch;
    if (this.isPhoneNumber) {
      this.invalidPhoneLength = errors?.minlength;
      this.invalidPhoneNumber = !this.invalidPhoneLength && errors?.validatePhoneNumber;
    } else if (this.isEdrpouIpn) {
      this.invalidEdrpouIpn = errors?.minlength && !errors?.maxlength;
    } else {
      this.invalidFieldLength = errors?.maxlength || errors?.minlength;
    }
    this.invalidTimeFormat = errors?.invalidTimeFormat;
    this.invalidTagsLength = errors?.minArrayLength || errors?.maxArrayLength;
  }

  private checkFormLevelValidationErrors(errors: ValidationErrors): void {
    this.invalidTimeRange = errors?.invalidTimeRange;
    this.invalidAgeRange = errors?.invalidAgeRange;
    this.cdr.markForCheck();
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
