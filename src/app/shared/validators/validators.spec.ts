import { FormControl, FormGroup } from '@angular/forms';
import { TimeRangeValidator } from './time-range-validator';
import { TimeFormatValidator } from './time-format-validator';

describe('TimeFormatValidator', () => {
  it('should be invalid time format', () => {
    const startTime = new FormControl('', [TimeFormatValidator()]);
    startTime?.setValue('12:00');
    expect(startTime.valid).toBeTruthy();

    startTime?.setValue('as:00');

    expect(startTime.errors).toEqual({ invalidTimeFormat: true });
  });
});

describe('TimeRangeValidator', () => {
  it('should return null for valid time range', () => {
    const formGroup = new FormGroup(
      {
        startTime: new FormControl('08:00'),
        endTime: new FormControl('18:00')
      },
      [TimeRangeValidator('startTime', 'endTime')]
    );

    expect(formGroup.errors).toBeNull();
  });

  it('should return invalidTimeRange error when start time is after end time', () => {
    const formGroup = new FormGroup(
      {
        startTime: new FormControl('19:00'),
        endTime: new FormControl('18:00')
      },
      [TimeRangeValidator('startTime', 'endTime')]
    );

    expect(formGroup.errors).toEqual({ invalidTimeRange: true });
    expect(formGroup.get('startTime')?.errors).toEqual({ invalidTimeRange: true });
    expect(formGroup.get('endTime')?.errors).toEqual({ invalidTimeRange: true });
  });
});
