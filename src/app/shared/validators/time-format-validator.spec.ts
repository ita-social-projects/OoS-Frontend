import { FormControl } from '@angular/forms';
import { TimeFormatValidator } from './time-format-validator';

describe('TimeFormatValidator', () => {
  it('should be invalid time format', () => {
    const startTime = new FormControl('', [TimeFormatValidator]);
    startTime.setValue('12:00');
    expect(startTime.valid).toBeTruthy();

    startTime.setValue('as:00');

    expect(startTime.errors).toEqual({ invalidTimeFormat: true });
  });
});
