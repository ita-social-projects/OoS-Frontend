import { FormControl, FormGroup } from '@angular/forms';
import { dateRangeValidator } from 'shared/validators/date-range/date-range-validator';

describe('dateRangeValidator', () => {
  let group: FormGroup;

  beforeEach(() => {
    group = new FormGroup({
      startDate: new FormControl(''),
      endDate: new FormControl('')
    });
  });

  it('should return null if the start date is before the end date', () => {
    group.controls.startDate.setValue('2025-04-17');
    group.controls.endDate.setValue('2025-04-18');
    const validator = dateRangeValidator('startDate', 'endDate');
    expect(validator(group)).toBeNull();
  });

  it('should return null if the start and end dates are the same', () => {
    group.controls.startDate.setValue('2025-04-17');
    group.controls.endDate.setValue('2025-04-17');
    const validator = dateRangeValidator('startDate', 'endDate');
    expect(validator(group)).toBeNull();
  });

  it('should return invalidDateRange error if the start date is after the end date', () => {
    group.controls.startDate.setValue('2025-04-18');
    group.controls.endDate.setValue('2025-04-17');
    const validator = dateRangeValidator('startDate', 'endDate');
    expect(validator(group)).toEqual({ invalidDateRange: true });
  });

  it('should return null if either start or end control is missing', () => {
    const groupWithoutControls = new FormGroup({});
    const validator = dateRangeValidator('startDate', 'endDate');
    expect(validator(groupWithoutControls)).toBeNull();
  });

  it('should return null if either start or end date value is null', () => {
    group.controls.startDate.setValue('2025-04-17');
    group.controls.endDate.setValue(null);
    const validator = dateRangeValidator('startDate', 'endDate');
    expect(validator(group)).toBeNull();

    group.controls.startDate.setValue(null);
    group.controls.endDate.setValue('2025-04-18');
    expect(validator(group)).toBeNull();
  });

  it('should return null if either start or end date value is undefined', () => {
    group.controls.startDate.setValue('2025-04-17');
    group.controls.endDate.setValue(undefined);
    const validator = dateRangeValidator('startDate', 'endDate');
    expect(validator(group)).toBeNull();

    group.controls.startDate.setValue(undefined);
    group.controls.endDate.setValue('2025-04-18');
    expect(validator(group)).toBeNull();
  });

  it('should return null if both start and end date values are empty strings', () => {
    group.controls.startDate.setValue('');
    group.controls.endDate.setValue('');
    const validator = dateRangeValidator('startDate', 'endDate');
    expect(validator(group)).toBeNull();
  });
});
