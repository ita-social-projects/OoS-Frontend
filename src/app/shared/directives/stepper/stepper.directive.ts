import { Directive, HostListener, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';

@Directive({
  selector: '[appStepperNext]'
})
export class StepperDirective {
  @Input() public form: FormGroup;
  @Input() public stepper: MatStepper;

  @HostListener('click', ['$event'])
  public onClick(event: Event): void {
    if (!this.form || !this.stepper) {
      return;
    }

    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();

    if (this.form.valid) {
      this.stepper.next();
      return;
    }

    const firstInvalidControl = Object.keys(this.form.controls).find((controlName) => this.form.get(controlName)?.invalid);

    if (firstInvalidControl) {
      const element = document.querySelector(`[formControlName="${firstInvalidControl}"]`);

      if (element) {
        (element as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => {
          (element as HTMLElement).focus();
        }, 300);
      }
    }
  }
}
