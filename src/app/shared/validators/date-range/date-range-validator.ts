import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function dateRangeValidator(startControlName: string, endControlName: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const startDateControl = group.get(startControlName);
    const endDateControl = group.get(endControlName);

    if (!startDateControl || !endDateControl || !startDateControl.value || !endDateControl.value) {
      return null;
    }

    const startDate = new Date(startDateControl.value);
    const endDate = new Date(endDateControl.value);

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    return startDate.getTime() > endDate.getTime() ? { invalidDateRange: true } : null;
  };
}
