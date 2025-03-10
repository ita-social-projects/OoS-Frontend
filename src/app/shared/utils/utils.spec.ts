import { Util } from './utils';

describe('formatTimeString', () => {
  it('should clean input value by removing non-numeric and non-colon characters', () => {
    const value = '12a:b3#4$';

    const validValue = Util.formatTimeString(value);

    expect(validValue).toBe('12:34');
  });

  it('should place column automatically', () => {
    const value = '2359';

    const validValue = Util.formatTimeString(value);

    expect(validValue).toBe('23:59');
  });
});

describe('formatAgeString', () => {
  it('should truncate value when exceeding MAX_AGE_LENGTH', () => {
    const value = 12345;

    const validValue = Util.formatAgeString(value);

    expect(validValue).toBe(123);
  });

  it('should return original value when under MAX_AGE_LENGTH', () => {
    expect(Util.formatAgeString(99)).toBe(99);
  });

  it('should handle null/undefined values', () => {
    expect(Util.formatAgeString(null)).toBeNull();
    expect(Util.formatAgeString(undefined)).toBeNull();
  });
});
