import { Directive, HostListener, Inject, Input } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { DOCUMENT } from '@angular/common';
import { MatStepper } from '@angular/material/stepper';
import { Store } from '@ngxs/store';
import { TranslateService } from '@ngx-translate/core';

import { ShowMessageBar } from 'shared/store/app.actions';

@Directive({
  selector: '[appStepperNext]'
})
export class StepperDirective {
  @Input() public form: FormGroup | FormArray;
  @Input() public stepper: MatStepper;
  @Input('appStepperNext') public submit!: (...args: any[]) => void;

  private stepElement!: HTMLElement;

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly store: Store,
    private readonly translateService: TranslateService
  ) {}

  @HostListener('click', ['$event'])
  public onClick(): void {
    if ((!this.submit && !this.form) || !this.stepper) {
      return;
    }

    if (this.form && this.form.valid && !this.submit) {
      this.stepper.next();
    } else if ((this.form?.valid ?? !this.form) && this.submit) {
      this.submit();
    } else {
      const stepIndex = this.stepper.selectedIndex;
      this.stepElement = this.document.querySelector(`[id^="cdk-step-content-"][id$="-${stepIndex}"]`);

      this.scrollToFirstInvalidControl();
    }
  }

  private scrollToFirstInvalidControl(): void {
    if (!this.stepElement) {
      return;
    }

    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();

    requestAnimationFrame(() => {
      const invalidFields = this.stepElement.querySelectorAll(
        'input.ng-invalid, select.ng-invalid, textarea.ng-invalid, .days-toggle-invalid, mat-select.ng-invalid, app-image-form-control.ng-invalid'
      ); // add a selector for a specific non-input type element

      if (invalidFields.length) {
        const message = this.translateService.instant('SERVICE_MESSAGES.SNACK_BAR_TEXT.REQUIRED_FIELDS_EMPTY');

        this.store.dispatch(new ShowMessageBar({ message, type: 'error' }));

        invalidFields[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
        (invalidFields[0] as HTMLElement).focus({ preventScroll: true });
      }
    });
  }
}
