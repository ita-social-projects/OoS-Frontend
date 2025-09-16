import { ChangeDetectorRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatCalendar } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS, MatDateFormats } from '@angular/material/core';
import { Subject } from 'rxjs';

import { MonthOnlyHeaderComponent } from './month-only-header.component';

describe('MonthOnlyHeaderComponent', () => {
  let component: MonthOnlyHeaderComponent<Date>;
  let mockCalendar: Partial<MatCalendar<Date>>;
  let mockAdapter: Partial<DateAdapter<Date>>;
  let mockFormats: MatDateFormats;
  let mockCdr: Partial<ChangeDetectorRef>;

  beforeEach(() => {
    mockCalendar = {
      activeDate: new Date(2025, 8, 1),
      stateChanges: new Subject<void>()
    };

    mockAdapter = {
      format: jest.fn((date: Date) => date.toDateString()),
      addCalendarMonths: jest.fn((date: Date, months: number) => {
        const newDate = new Date(date);
        newDate.setMonth(newDate.getMonth() + months);
        return newDate;
      })
    };

    mockFormats = {
      parse: { dateInput: 'LL' },
      display: { monthYearLabel: 'MMM yyyy', dateInput: 'LL', monthYearA11yLabel: 'MMMM yyyy', dateA11yLabel: 'LL' }
    };

    mockCdr = { markForCheck: jest.fn() };

    TestBed.configureTestingModule({
      providers: [
        { provide: MatCalendar, useValue: mockCalendar },
        { provide: DateAdapter, useValue: mockAdapter },
        { provide: MAT_DATE_FORMATS, useValue: mockFormats },
        { provide: ChangeDetectorRef, useValue: mockCdr }
      ]
    });

    component = new MonthOnlyHeaderComponent(
      mockCalendar as MatCalendar<Date>,
      mockAdapter as DateAdapter<Date>,
      mockFormats,
      mockCdr as ChangeDetectorRef
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('periodLabel should return upper case', () => {
    (mockAdapter.format as jest.Mock).mockReturnValue('Sep 2025');
    expect(component.periodLabel).toBe('SEP 2025');
  });

  it('previousClicked should reduce month by 1', () => {
    const currentDate = mockCalendar.activeDate;
    component.previousClicked();
    expect(mockAdapter.addCalendarMonths).toHaveBeenCalledWith(currentDate, -1);
  });

  it('nextClicked should increase month by 1', () => {
    const currentDate = mockCalendar.activeDate;
    component.nextClicked();
    expect(mockAdapter.addCalendarMonths).toHaveBeenCalledWith(currentDate, 1);
  });

  it('should call markForCheck if stateChanges fired', () => {
    (mockCalendar.stateChanges as Subject<void>).next();
    expect(mockCdr.markForCheck).toHaveBeenCalled();
  });
});
