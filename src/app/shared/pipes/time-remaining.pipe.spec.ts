import { TranslateService } from '@ngx-translate/core';
import { TimeRemainingPipe } from './time-remaining.pipe';

describe('TimeRemainingPipe', () => {
  let pipe: TimeRemainingPipe;
  let translateService: TranslateService;

  beforeEach(() => {
    translateService = { currentLang: 'ua' } as TranslateService;
    pipe = new TimeRemainingPipe(translateService);
  });

  it('should create', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return empty string for null input', () => {
    expect(pipe.transform(null)).toBe('');
  });

  it('should handle days correctly', () => {
    expect(pipe.transform('2:0:0')).toBe('Залишилось 2 дні');
    expect(pipe.transform('1:0:0')).toBe('Залишилось 1 день');
    expect(pipe.transform('5:0:0')).toBe('Залишилось 5 днів');
  });

  it('should handle hours correctly', () => {
    expect(pipe.transform('0:2:0')).toBe('Залишилось 2 години');
    expect(pipe.transform('0:1:0')).toBe('Залишилось 1 година');
    expect(pipe.transform('0:5:0')).toBe('Залишилось 5 годин');
  });

  it('should handle minutes correctly', () => {
    expect(pipe.transform('0:0:2')).toBe('Залишилось 2 хвилини');
    expect(pipe.transform('0:0:1')).toBe('Залишилось 1 хвилина');
    expect(pipe.transform('0:0:5')).toBe('Залишилось 5 хвилин');
  });

  it('should return "less than a minute" for zero values', () => {
    expect(pipe.transform('0:0:0')).toBe('Залишилось менше хвилини');
  });
});
