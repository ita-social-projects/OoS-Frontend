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

describe('deepEqual', () => {
  it('should return true for equal primitive values', () => {
    const obj1 = { a: 1, b: 'test' };
    const obj2 = { a: 1, b: 'test' };
    expect(Util.deepEqual(obj1, obj2)).toBe(true);
  });

  it('should return false for unequal primitive values', () => {
    const obj1 = { a: 1, b: 'test' };
    const obj2 = { a: 1, b: 'different' };
    expect(Util.deepEqual(obj1, obj2)).toBe(false);
  });

  it('should return false for different objects', () => {
    const obj1 = { a: 1, b: 'test' };
    const obj2 = { a: 1, c: 'test' };
    expect(Util.deepEqual(obj1, obj2)).toBe(false);
  });

  it('should return true for equal nested objects', () => {
    const obj1 = { a: { b: 1 }, c: 2 };
    const obj2 = { a: { b: 1 }, c: 2 };
    expect(Util.deepEqual(obj1, obj2)).toBe(true);
  });

  it('should return false for unequal nested objects', () => {
    const obj1 = { a: { b: 1 }, c: 2 };
    const obj2 = { a: { b: 2 }, c: 2 };
    expect(Util.deepEqual(obj1, obj2)).toBe(false);
  });

  it('should return false when one object is null', () => {
    const obj1 = { a: 1 };
    const obj2 = null;
    expect(Util.deepEqual(obj1, obj2)).toBe(false);
  });

  it('should return true when both objects are null', () => {
    const obj1 = null;
    const obj2 = null;
    expect(Util.deepEqual(obj1, obj2)).toBe(true);
  });

  it('should return false when one object is undefined', () => {
    const obj1 = { a: 1 };
    const obj2 = undefined;
    expect(Util.deepEqual(obj1, obj2)).toBe(false);
  });

  it('should return true for objects with the same keys in different order', () => {
    const obj1 = { a: 1, b: 2 };
    const obj2 = { b: 2, a: 1 };
    expect(Util.deepEqual(obj1, obj2)).toBe(true);
  });

  it('should return true for empty objects', () => {
    const obj1 = {};
    const obj2 = {};
    expect(Util.deepEqual(obj1, obj2)).toBe(true);
  });

  it('should return false for object and array comparison', () => {
    const obj1 = { a: 1 };
    const obj2 = [1];
    expect(Util.deepEqual(obj1, obj2)).toBe(false);
  });

  it('should return true for objects with nested arrays', () => {
    const obj1 = { a: [1, 2], b: 3 };
    const obj2 = { a: [1, 2], b: 3 };
    expect(Util.deepEqual(obj1, obj2)).toBe(true);
  });

  it('should return false for objects with nested arrays of different lengths', () => {
    const obj1 = { a: [1, 2], b: 3 };
    const obj2 = { a: [1, 2, 3], b: 3 };
    expect(Util.deepEqual(obj1, obj2)).toBe(false);
  });

  it('should return false for objects with nested arrays of different values', () => {
    const obj1 = { a: [1, 2], b: 3 };
    const obj2 = { a: [1, 3], b: 3 };
    expect(Util.deepEqual(obj1, obj2)).toBe(false);
  });
});

describe('isEmpty', () => {
  it('should return true for undefined', () => {
    expect(Util.isEmpty(undefined)).toBe(true);
  });

  it('should return true for null', () => {
    expect(Util.isEmpty(null)).toBe(true);
  });

  it('should return true for empty string', () => {
    expect(Util.isEmpty('')).toBe(true);
  });

  it('should return false for non-empty string', () => {
    expect(Util.isEmpty('test')).toBe(false);
  });

  it('should return true for empty array', () => {
    expect(Util.isEmpty([])).toBe(true);
  });

  it('should return false for non-empty array', () => {
    expect(Util.isEmpty([1, 2, 3])).toBe(false);
  });

  it('should return false for non-empty object', () => {
    expect(Util.isEmpty({ a: 1 })).toBe(false);
  });

  it('should return true for object with empty values', () => {
    expect(Util.isEmpty({})).toBe(true);
  });

  it('should return false for boolean true', () => {
    expect(Util.isEmpty(true)).toBe(false);
  });

  it('should return false for boolean false', () => {
    expect(Util.isEmpty(false)).toBe(false);
  });

  it('should return false for number 0', () => {
    expect(Util.isEmpty(0)).toBe(false);
  });

  it('should return false for non-empty object with nested properties', () => {
    expect(Util.isEmpty({ a: { b: 1 } })).toBe(false);
  });

  it('should return false for an array with an empty object', () => {
    expect(Util.isEmpty([{}])).toBe(false);
  });
});

describe('isEmptyUUID', () => {
  it('should return false for normal', () => {
    expect(Util.isEmptyUUID('12345678-0101-2030-0000-001200000000')).toBe(false);
  });

  it('should return true for empty', () => {
    expect(Util.isEmptyUUID('00000000-0000-0000-0000-000000000000')).toBe(true);
  });

  it('should return true for undefined | null', () => {
    expect(Util.isEmptyUUID(null)).toBe(true);
    expect(Util.isEmptyUUID(undefined)).toBe(true);
  });
});
