import { Directive, HostListener, Inject, Input } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { Store } from '@ngxs/store';
import { TranslateService } from '@ngx-translate/core';
import { WINDOW } from 'ngx-window-token';

import { ShowMessageBar } from 'shared/store/app.actions';
import { take } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';

@Directive({
  selector: '[appStepperNext]'
})
export class StepperDirective {
  @Input() public form: FormGroup | FormArray;
  @Input() public stepper: MatStepper;

  private stepElement!: HTMLElement;

  constructor(
    @Inject(WINDOW) private readonly window: Window,
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly store: Store,
    private readonly translateService: TranslateService
  ) {}

  @HostListener('click', ['$event'])
  public onClick(): void {
    if (!this.form || !this.stepper) {
      return;
    }

    if (this.form.valid) {
      this.stepper.next();
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
        'input.ng-invalid, select.ng-invalid, textarea.ng-invalid, .days-toggle-invalid, mat-select.ng-invalid'
      ); // add selector for a specific non-input type element

      if (invalidFields.length) {
        this.translateService
          .get('SERVICE_MESSAGES.SNACK_BAR_TEXT.REQUIRED_FIELDS_EMPTY')
          .pipe(take(1))
          .subscribe((text) => {
            this.store.dispatch(new ShowMessageBar({ message: text, type: 'error' }));

            invalidFields[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
            (invalidFields[0] as HTMLElement).focus({ preventScroll: true });
          });
      }
    });
  }
}
