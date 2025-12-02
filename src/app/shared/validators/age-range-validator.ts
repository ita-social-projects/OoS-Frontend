import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function AgeRangeValidator(startCtrlName: string = 'startAge', endCtrlName: string = 'endAge'): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const startCtrl = formGroup.get(startCtrlName);
    const endCtrl = formGroup.get(endCtrlName);

    if (!startCtrl || !endCtrl) {
      return null;
    }

    if (startCtrl.value !== null && endCtrl.value !== null && startCtrl.value >= endCtrl.value) {
      const newGroupErrors = { invalidAgeRange: true };

      startCtrl.setErrors({ ...startCtrl.errors, invalidAgeRange: true });
      endCtrl.setErrors({ ...endCtrl.errors, invalidAgeRange: true });

      return newGroupErrors;
    } else {
      const startErrors = startCtrl.errors || {};
      const endErrors = endCtrl.errors || {};

      delete startErrors?.invalidAgeRange;
      delete endErrors?.invalidAgeRange;

      startCtrl.setErrors(Object.keys(startErrors).length ? startErrors : null, { emitEvent: false });
      endCtrl.setErrors(Object.keys(endErrors).length ? endErrors : null, { emitEvent: false });

      return null;
    }
  };
}
