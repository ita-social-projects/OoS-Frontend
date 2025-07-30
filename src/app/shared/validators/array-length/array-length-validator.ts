import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function minArrayLength(minLength: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    if (!Array.isArray(value)) {
      return { notArray: true };
    }

    return value.length >= minLength
      ? null
      : {
          minArrayLength: {
            requiredLength: minLength,
            actualLength: value.length
          }
        };
  };
}

export function maxArrayLength(maxLength: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    if (!Array.isArray(value)) {
      return { notArray: true };
    }

    return value.length <= maxLength
      ? null
      : {
          maxArrayLength: {
            requiredLength: maxLength,
            actualLength: value.length
          }
        };
  };
}
