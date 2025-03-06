import { Directive, HostListener, Inject, Input } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { WINDOW } from 'ngx-window-token';
import { Store } from '@ngxs/store';
import { ShowMessageBar } from 'shared/store/app.actions';

@Directive({
  selector: '[appStepperNext]'
})
export class StepperDirective {
  @Input() public form: FormGroup | FormArray;
  @Input() public stepper: MatStepper;

  private stepElement!: HTMLElement;

  constructor(
    @Inject(WINDOW) private window: Window,
    private store: Store
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
      // eslint-disable-next-line prettier/prettier
      this.store.dispatch(new ShowMessageBar({ message: 'Заповність обов\'язкові поля', type: 'error' }));
      setTimeout(() => (invalidFields[0] as HTMLElement).focus(), 1000);
    }
  }
}
