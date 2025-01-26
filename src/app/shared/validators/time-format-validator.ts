import { AbstractControl, ValidationErrors } from '@angular/forms';
import { TIME_FORMAT_REGEX } from 'shared/constants/regex-constants';

export const TimeFormatValidator = (control: AbstractControl): ValidationErrors | null => {
  const value = control.value;
  if (!value) {
    return null;
  }

  const valid = TIME_FORMAT_REGEX.test(value);
  return valid ? null : { invalidTimeFormat: true };
};
