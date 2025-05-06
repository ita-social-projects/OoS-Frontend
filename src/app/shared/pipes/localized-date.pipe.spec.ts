import { LocalizedDatePipe } from './localized-date.pipe';

describe('LocalizedDatePipe', () => {
  let pipe: LocalizedDatePipe;
  const mockTranslateService = {
    instant: jest.fn()
  };

  beforeEach(() => {
    mockTranslateService.instant.mockClear();
    mockTranslateService.instant.mockImplementation((key: string | string[]) => {
      if (key === 'MONTHS.NAMES') {
        return ['січня', 'лютого', 'березня', 'квітня', 'травня', 'червня', 'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня'];
      }
      return key;
    });

    pipe = new LocalizedDatePipe(mockTranslateService as any);
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return null for null input', () => {
    expect(pipe.transform(null)).toBeNull();
  });

  it('should return null for undefined input', () => {
    expect(pipe.transform(undefined)).toBeNull();
  });

  it('should format a valid date string (YYYY-MM-DD)', () => {
    const dateString = '2000-09-01';
    expect(pipe.transform(dateString)).toBe('1 вересня');
  });

  it('should format another valid date string', () => {
    const dateString = '2023-12-31';
    expect(pipe.transform(dateString)).toBe('31 грудня');
  });

  it('should return DD/MM/YYYY fallback if MONTHS.NAMES is not an array', () => {
    mockTranslateService.instant.mockReturnValue('Not an array');
    const dateString = '2023-04-10';
    expect(pipe.transform(dateString)).toBe('10/4/2023');
  });

  it('should return DD/MM/YYYY fallback if month index is out of bounds for month names array', () => {
    mockTranslateService.instant.mockImplementationOnce(() => ['Jan', 'Feb', 'Mar']);
    const dateString = '2023-09-15';
    expect(pipe.transform(dateString)).toBe('15/9/2023');
  });

  it('should format date correctly if new Date handles invalid month (e.g., month 13)', () => {
    const dateString = '2000-13-01';
    expect(pipe.transform(dateString)).toBe('1 січня');
  });
});
