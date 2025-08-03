import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function ImageControlValidator(field1: string, field2: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const field1Value = group.get(field1)?.value;
    const field2Value = group.get(field2)?.value;

    const isField1Empty = !field1Value || (Array.isArray(field1Value) && field1Value.length === 0);
    const isField2Empty = field2Value.length === 0;

    if (isField1Empty && isField2Empty && group.get(field1)?.touched) {
      return { imageControlError: true };
    }

    return null;
  };
}
