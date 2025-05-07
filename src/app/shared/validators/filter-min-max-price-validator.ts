import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { MinMaxPriceFilter } from 'shared/models/filter-list.model';

export function MinMaxPriceValidator(minMax: string, limitMinMaxPrice: MinMaxPriceFilter, currentMinMaxPrice: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let error: ValidationErrors | null = null;
    if (limitMinMaxPrice?.isActiveLimitation) {
      const value = control.value;
      if (minMax === 'min') {
        if (value < limitMinMaxPrice.minPrice || value > limitMinMaxPrice.maxPrice || value > currentMinMaxPrice) {
          error = { minPriceFilterError: true };
        }
      } else if (minMax === 'max') {
        if (value > limitMinMaxPrice.maxPrice || value < limitMinMaxPrice.minPrice || value < currentMinMaxPrice) {
          error = { maxPriceFilterError: true };
        }
      }
    }
    return error;
  };
}
