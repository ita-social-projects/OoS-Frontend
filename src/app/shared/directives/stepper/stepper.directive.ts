import { Directive, HostListener, Inject, Input } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { Store } from '@ngxs/store';
import { TranslateService } from '@ngx-translate/core';
import { WINDOW } from 'ngx-window-token';
import { asyncScheduler } from 'rxjs';

import { ShowMessageBar } from 'shared/store/app.actions';

@Directive({
  selector: '[appStepperNext]'
})
export class StepperDirective {
  @Input() public form: FormGroup | FormArray;
  @Input() public stepper: MatStepper;

  private stepElement!: HTMLElement;

  constructor(
    @Inject(WINDOW) private readonly window: Window,
    private readonly store: Store,
    private readonly translateService: TranslateService
  ) {}

  @HostListener('click', ['$event'])
  public onClick(event: Event): void {
    if (!this.form || !this.stepper) {
      return;
    }

    if (this.form.valid) {
      this.stepper.next();
    } else {
      const stepIndex = this.stepper.selectedIndex;
      this.stepElement = document.getElementById(`cdk-step-content-0-${stepIndex}`);
      this.scrollToFirstInvalidControl();
    }
  }

  private scrollToFirstInvalidControl(): void {
    if (!this.stepElement) {
      return;
    }

    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();

    const invalidFields = this.stepElement.querySelectorAll(
      'input.ng-invalid, select.ng-invalid, textarea.ng-invalid, .days-toggle-invalid, mat-select.ng-invalid'
    ); // add selector for a specific non-input type element
    if (invalidFields.length) {
      invalidFields[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
      this.translateService.get('SERVICE_MESSAGES.SNACK_BAR_TEXT.REQUIRED_FIELDS_EMPTY').subscribe((text) => {
        this.store.dispatch(new ShowMessageBar({ message: text, type: 'error' }));
        asyncScheduler.schedule(() => (invalidFields[0] as HTMLElement).focus(), 1000);
      });
    }
  }
}
