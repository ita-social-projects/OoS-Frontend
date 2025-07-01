import { FormControl } from '@angular/forms';
import { MinMaxPriceFilter } from 'shared/models/filter-list.model';
import { MinMaxPriceValidator } from './filter-min-max-price-validator';

describe('MinMaxPriceValidator', () => {
  const limitMinMaxPrice: MinMaxPriceFilter = {
    minPrice: 10,
    maxPrice: 100,
    isActiveLimitation: true
  };

  it('should return null if the value is within the valid range for "min"', () => {
    const control = new FormControl(20);
    const validator = MinMaxPriceValidator('min', limitMinMaxPrice, 50);
    const result = validator(control);

    expect(result).toBeNull();
  });

  it('should return an error if the value is less than the minimum for "min"', () => {
    const control = new FormControl(5);
    const validator = MinMaxPriceValidator('min', limitMinMaxPrice, 50);
    const result = validator(control);

    expect(result).toEqual({ minPriceFilterError: true });
  });

  it('should return an error if the value is greater than the maximum for "min"', () => {
    const control = new FormControl(150);
    const validator = MinMaxPriceValidator('min', limitMinMaxPrice, 50);
    const result = validator(control);

    expect(result).toEqual({ minPriceFilterError: true });
  });

  it('should return an error if the value is greater than the current max price for "min"', () => {
    const control = new FormControl(60);
    const validator = MinMaxPriceValidator('min', limitMinMaxPrice, 50);
    const result = validator(control);

    expect(result).toEqual({ minPriceFilterError: true });
  });

  it('should return null if the value is within the valid range for "max"', () => {
    const control = new FormControl(80);
    const validator = MinMaxPriceValidator('max', limitMinMaxPrice, 50);
    const result = validator(control);

    expect(result).toBeNull();
  });

  it('should return an error if the value is greater than the maximum for "max"', () => {
    const control = new FormControl(150);
    const validator = MinMaxPriceValidator('max', limitMinMaxPrice, 50);
    const result = validator(control);

    expect(result).toEqual({ maxPriceFilterError: true });
  });

  it('should return an error if the value is less than the minimum for "max"', () => {
    const control = new FormControl(5);
    const validator = MinMaxPriceValidator('max', limitMinMaxPrice, 50);
    const result = validator(control);

    expect(result).toEqual({ maxPriceFilterError: true });
  });

  it('should return an error if the value is less than the current min price for "max"', () => {
    const control = new FormControl(40);
    const validator = MinMaxPriceValidator('max', limitMinMaxPrice, 50);
    const result = validator(control);

    expect(result).toEqual({ maxPriceFilterError: true });
  });

  it('should return null if isActiveLimitation is false', () => {
    const control = new FormControl(5);
    const limitMinMaxPriceInactive: MinMaxPriceFilter = {
      minPrice: 10,
      maxPrice: 100,
      isActiveLimitation: false
    };
    const validator = MinMaxPriceValidator('min', limitMinMaxPriceInactive, 50);
    const result = validator(control);

    expect(result).toBeNull();
  });
});
