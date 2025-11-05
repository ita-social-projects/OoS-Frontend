import { firstValueFrom } from 'rxjs';
import { base64ArrayToFiles, blobsToBase64, blobToBase64, mapDescriptionInfo } from 'shared/utils/provider.utils';
import { base64ToFile } from 'ngx-image-cropper';
import { Description } from 'shared/models/competition.model';
import { addBeforeUnloadProtection, arraysEqualByValue, Util } from './utils';

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

  it('should return true for an array with an empty object', () => {
    expect(Util.isEmpty([{}])).toBe(true);
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

describe('addBeforeUnloadProtection', () => {
  let addEventListenerSpy: jest.SpyInstance;
  let removeEventListenerSpy: jest.SpyInstance;

  beforeEach(() => {
    addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should add beforeunload listener', () => {
    const shouldBlock = jest.fn().mockReturnValue(false);
    const remove = addBeforeUnloadProtection(shouldBlock);

    expect(addEventListenerSpy).toHaveBeenCalledWith('beforeunload', expect.any(Function));
    remove();
    expect(removeEventListenerSpy).toHaveBeenCalledWith('beforeunload', expect.any(Function));
  });

  it('should block reload if shouldBlock is true', () => {
    const shouldBlock = jest.fn().mockReturnValue(true);
    const event = {
      preventDefault: jest.fn(),
      returnValue: ''
    } as unknown as BeforeUnloadEvent;

    addBeforeUnloadProtection(shouldBlock);
    const handler = addEventListenerSpy.mock.calls[0][1] as (e: BeforeUnloadEvent) => void;
    handler(event);

    expect(shouldBlock).toHaveBeenCalled();
    expect(event.preventDefault).toHaveBeenCalled();
    expect(event.returnValue).toBe('');
  });

  it('should not block if shouldBlock is false', () => {
    const shouldBlock = jest.fn().mockReturnValue(false);
    const event = {
      preventDefault: jest.fn(),
      returnValue: ''
    } as unknown as BeforeUnloadEvent;

    addBeforeUnloadProtection(shouldBlock);

    const handler = addEventListenerSpy.mock.calls[0][1] as (e: BeforeUnloadEvent) => void;
    handler(event);

    expect(shouldBlock).toHaveBeenCalled();
    expect(event.preventDefault).not.toHaveBeenCalled();
    expect(event.returnValue).toBe('');
  });
});

describe('image convertation utils', () => {
  it('should convert blob to base64 string', async () => {
    const blob = new Blob(['hello world'], { type: 'text/plain' });

    const result = await firstValueFrom(blobToBase64(blob));

    expect(result).toContain('data:text/plain;base64,');
    expect(typeof result).toBe('string');
  });

  it('should convert multiple blobs to base64 strings', async () => {
    const blobs = [new Blob(['one'], { type: 'text/plain' }), new Blob(['two'], { type: 'text/plain' })];

    const result = await firstValueFrom(blobsToBase64(blobs));

    expect(result.length).toBe(2);
    expect(result[0]).toContain('data:text/plain;base64,');
    expect(result[1]).toContain('data:text/plain;base64,');
  });

  it('should convert base64 string', () => {
    const base64 = 'data:text/plain;base64,aGVsbG8=';
    const file = base64ToFile(base64);

    expect(file).toBeInstanceOf(Blob);
    expect(file.type).toBe('text/plain');
  });

  it('should convert array of base64 strings to File[]', () => {
    const base64Array = ['data:text/plain;base64,aGVsbG8=', 'data:text/plain;base64,d29ybGQ='];

    const files = base64ArrayToFiles(base64Array);

    expect(files.length).toBe(2);
    expect(files[0]).toBeInstanceOf(Blob);
    expect(files[1].name).toBe('image');
  });
});

describe('arraysEqualByValue', () => {
  it('should return true for equal arrays', () => {
    expect(arraysEqualByValue([1, 2, 3], [1, 2, 3])).toBe(true);
  });

  it('should return false for unequal arrays', () => {
    expect(arraysEqualByValue([1, 2, 3], [1, 2, 4])).toBe(false);
  });

  it('should return false for arrays of different lengths', () => {
    expect(arraysEqualByValue([1, 2, 3], [1, 2])).toBe(false);
  });

  it('should return true for empty arrays', () => {
    expect(arraysEqualByValue([], [])).toBe(true);
  });

  it('should return true for arrays with the same values in different order', () => {
    expect(arraysEqualByValue([1, 2, 3], [3, 2, 1])).toBe(true);
  });
});

describe('mapDescriptionInfo', () => {
  it('should map, clean and enrich description info correctly', () => {
    const mockDescription = {
      formOfLearning: 'online',
      directionId: 1,
      subDirectionIds: [10, 20],
      competitiveEventDescriptionItems: [
        { someSection: 'item1', competitiveEventId: 5 },
        { someSection: 'item2', competitiveEventId: 6 }
      ]
    };

    const result = mapDescriptionInfo(mockDescription as unknown as Description);

    expect(result).toEqual({
      formOfLearning: 'online',
      directionId: 1,
      subDirectionIds: [10, 20],
      plannedFormatOfClasses: 'online',
      competitiveEventDescriptionItems: [{ someSection: 'item1' }, { someSection: 'item2' }],
      directionSubDirectionIds: [
        { directionId: 1, subDirectionId: 10 },
        { directionId: 1, subDirectionId: 20 }
      ]
    });
  });
});
