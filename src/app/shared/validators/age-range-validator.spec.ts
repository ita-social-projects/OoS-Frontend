import { FormControl, FormGroup } from '@angular/forms';
import { AgeRangeValidator } from './age-range-validator';

describe('AgeRangeValidator', () => {
  it('should return null for valid age range', () => {
    const formGroup = new FormGroup(
      {
        startAge: new FormControl(12),
        endAge: new FormControl(14)
      },
      [AgeRangeValidator('startAge', 'endAge')]
    );

    expect(formGroup.errors).toBeNull();
  });

  it('should return invalidAgeRange error when start age is greater than end age', () => {
    const formGroup = new FormGroup(
      {
        startAge: new FormControl(14),
        endAge: new FormControl(12)
      },
      [AgeRangeValidator('startAge', 'endAge')]
    );

    expect(formGroup.errors).toEqual({ invalidAgeRange: true });
    expect(formGroup.get('startAge')?.errors).toEqual({ invalidAgeRange: true });
    expect(formGroup.get('endAge')?.errors).toEqual({ invalidAgeRange: true });
  });

  it('should save previous error', () => {
    const formGroup = new FormGroup(
      {
        startAge: new FormControl(14),
        endAge: new FormControl(12)
      },
      [AgeRangeValidator('startAge', 'endAge')]
    );
    formGroup.get('startAge').setErrors({ validationError: true });

    formGroup.get('endAge').setValue(16);

    expect(formGroup.get('startAge').errors).toEqual({ validationError: true });
  });
});
