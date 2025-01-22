import { validateTimeInput } from './time-input-validator';

it('should clean input value by removing non-numeric and non-colon characters', () => {
  const value = '12a:b3#4$';

  const validValue = validateTimeInput(value);

  expect(validValue).toBe('12:34');
});
