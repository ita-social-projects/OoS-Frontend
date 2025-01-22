import { validateAgeInput } from './age-input-validator';

it('should clean input value by removing non-numeric and non-colon characters', () => {
  const value = 12345;

  const validValue = validateAgeInput(value);

  expect(validValue).toBe(123);
});
