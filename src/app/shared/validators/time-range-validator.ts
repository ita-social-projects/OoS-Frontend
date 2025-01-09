import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import * as moment from 'moment';

export function TimeRangeValidator(startCtrlName: string = 'startTime', endCtrlName: string = 'endTime'): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const startCtrl = formGroup.get(startCtrlName);
    const endCtrl = formGroup.get(endCtrlName);

    if (!startCtrl || !endCtrl) {
      return null;
    }

    const startTime = moment(startCtrl.value, 'HH:mm');
    const endTime = moment(endCtrl.value, 'HH:mm');

    if (startTime.isSameOrAfter(endTime)) {
      const newGroupErrors = { invalidTimeRange: true };

      startCtrl.setErrors({ invalidTimeRange: true });
      endCtrl.setErrors({ invalidTimeRange: true });

      return newGroupErrors;
    } else {
      const startErrors = startCtrl.errors || {};
      const endErrors = endCtrl.errors || {};

      delete startErrors?.invalidTimeRange;
      delete endErrors?.invalidTimeRange;

      startCtrl.setErrors(Object.keys(startErrors).length ? startErrors : null);
      endCtrl.setErrors(Object.keys(endErrors).length ? endErrors : null);

      return null;
    }
  };
}
