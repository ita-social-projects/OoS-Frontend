import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { TIME_FORMAT_REGEX } from 'shared/constants/regex-constants';

export function TimeFormatValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return null;
    }

    const valid = TIME_FORMAT_REGEX.test(value);
    return valid ? null : { invalidTimeFormat: true };
  };
}
