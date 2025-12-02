import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function DateRangeValidator(startCtrlName: string = 'startDate', endCtrlName: string = 'endDate'): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const startCtrl = formGroup.get(startCtrlName)?.value;
    const endCtrl = formGroup.get(endCtrlName)?.value;

    if (!startCtrl || !endCtrl) {
      return null;
    }

    if (startCtrl.isAfter(endCtrl) || endCtrl.isBefore(startCtrl)) {
      return { invalidDateRange: true };
    }

    return null;
  };
}
