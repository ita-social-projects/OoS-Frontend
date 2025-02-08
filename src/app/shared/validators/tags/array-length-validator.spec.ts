import { FormControl } from '@angular/forms';
import { minArrayLength } from 'shared/validators/tags/array-length-validator';
import { maxArrayLength } from 'shared/validators/tags/array-length-validator';

describe('ArrayLengthValidator', () => {
  it('should return null when length is [3,15]', () => {
    const numbers: FormControl = new FormControl([1, 2, 3, 4, 5], [minArrayLength(3), maxArrayLength(6)]);

    expect(numbers.errors).toBeNull();
  });

  it('should return minArrayLength error when the length is lower than 3', () => {
    const numbers: FormControl = new FormControl([1, 2], [minArrayLength(3), maxArrayLength(6)]);

    expect(numbers.errors).toEqual({ minArrayLength: { requiredLength: 3, actualLength: 2 } });
  });

  it('should return maxArrayLength error when the length is lower than 3', () => {
    const numbers: FormControl = new FormControl([1, 2, 3, 4, 5, 6, 7], [minArrayLength(3), maxArrayLength(6)]);

    expect(numbers.errors).toEqual({ maxArrayLength: { requiredLength: 6, actualLength: 7 } });
  });
});
