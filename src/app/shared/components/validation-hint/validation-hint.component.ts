import { debounceTime, takeUntil } from 'rxjs/operators';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormControl, ValidationErrors } from '@angular/forms';
import { Subject } from 'rxjs';
import { Constants } from '../../constants/constants';

enum ValidatorsTypes {
  requiredField,
  validLength,
  validTextField
}
@Component({
  selector: 'app-validation-hint',
  templateUrl: './validation-hint.component.html',
  styleUrls: ['./validation-hint.component.scss']
})
export class ValidationHintComponent implements OnInit, OnDestroy {
  readonly dateFormPlaceholder = Constants.DATE_FORMAT_PLACEHOLDER;

  @Input() validationFormControl: FormControl; //required for validation

  //for Length Validation
  @Input() minCharachters: number;
  @Input() maxCharachters: number;

  //for Date Format Validation
  @Input() minMaxDate: boolean;

  //for Text Field Validation
  @Input() allowedCharacters: string;

  required: boolean;
  invalid: boolean;
  invalidText: boolean;
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
      //Check is the field valid
      this.invalid = this.validationFormControl.invalid && this.validationFormControl.touched;

      //Check is the field required and empty
      this.required = !!(this.validationFormControl.errors?.required && !this.validationFormControl.value);

      //Check Date Picker Format
      this.minMaxDate && this.checkMatDatePciker();

      //Check errors from validators
      this.checkValidationErrors(this.validationFormControl.errors);
    })
  }

  private checkValidationErrors(errors: ValidationErrors): void {
    this.invalidEmail = !!errors?.email;
    this.invalidText = !!errors?.pattern?.requiredPattern;
    this.invalidLength = !!(errors?.maxlength || errors?.minlength);
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