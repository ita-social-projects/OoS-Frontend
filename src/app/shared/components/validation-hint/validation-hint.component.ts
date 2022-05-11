import { debounceTime, takeUntil } from 'rxjs/operators';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';

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

  @Input() validationFormControl: FormControl;

  @Input() minCharachters;
  @Input() maxCharachters;

  forbiddenCharacters: boolean;
  required: boolean;
  invalid: boolean;
  invalidLength: boolean;
  invalidDateRange: boolean;
  destroy$: Subject<boolean> = new Subject<boolean>();

  allowedSymbold;

  constructor() {
  }

  ngOnInit(): void {
    this.validationFormControl.statusChanges.pipe(
      debounceTime(200),
      takeUntil(this.destroy$)
    ).subscribe(()=>{
      this.invalid = this.validationFormControl.invalid && this.validationFormControl.touched;

      this.checkRequiredValidation();
      this.checkValidTextField();
      this.checkValidLength();
      this.checkValidDateRange();
      this.checkValidDateRange();

    })
  }
  checkRequiredValidation(): void {
    this.required = !!this.validationFormControl.errors?.required;
  }

  checkValidTextField(): void {
    this.forbiddenCharacters = !!this.validationFormControl.errors?.pattern?.requiredPattern;
    // this.allowedSymbold = this.validationFormControl.errors?.pattern;

  }

  checkValidLength(): void {
    this.invalidLength = !!(this.validationFormControl.errors?.maxLength || this.validationFormControl.errors?.minLength);
  }

  checkValidDateRange(): void {
    this.invalidDateRange = !!(this.validationFormControl.errors?.matDatepickerMin || this.validationFormControl.errors?.matDatepickerMax);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}

//[minMaxDate]="ChildFormGroup.get('dateOfBirth').hasError('matDatepickerMin') || ChildFormGroup.get('dateOfBirth').hasError('matDatepickerMax')">
