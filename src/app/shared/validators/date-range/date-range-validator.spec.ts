import { FormControl, FormGroup } from '@angular/forms';
import moment from 'moment';
import { DateRangeValidator } from 'shared/validators/date-range/date-range-validator';

describe('DateRangeValidator', () => {
  it('should return null for valid date range', () => {
    const formGroup = new FormGroup(
      {
        startDate: new FormControl(moment()),
        endDate: new FormControl(moment().add(10, 'days'))
      },
      [DateRangeValidator('startDate', 'endDate')]
    );

    expect(formGroup.errors).toBeNull();
  });

  it('should return invalidDateRange error when start date is after end date', () => {
    const formGroup = new FormGroup(
      {
        startDate: new FormControl(moment().add(10, 'days')),
        endDate: new FormControl(moment())
      },
      [DateRangeValidator('startDate', 'endDate')]
    );

    expect(formGroup.errors).toEqual({ invalidDateRange: true });
  });

  it('should return null if control is not defined', () => {
    const formGroup = new FormGroup(
      {
        startDate: new FormControl(moment())
      },
      [DateRangeValidator('startDate', 'endDate')]
    );

    expect(formGroup.errors).toBeNull();
  });

  it('should return null if control value is not defined', () => {
    const formGroup = new FormGroup(
      {
        startDate: new FormControl(moment()),
        endDate: new FormControl(null)
      },
      [DateRangeValidator('startDate', 'endDate')]
    );

    expect(formGroup.errors).toBeNull();
  });
});
