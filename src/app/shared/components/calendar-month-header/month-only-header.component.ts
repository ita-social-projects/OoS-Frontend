import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { MatCalendar } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS, MatDateFormats } from '@angular/material/core';
import { takeUntil } from 'rxjs/operators';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'calendar-header',
  templateUrl: './month-only-header.component.html',
  styleUrls: ['./month-only-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MonthOnlyHeaderComponent<D> implements OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(
    private _calendar: MatCalendar<D>,
    private _dateAdapter: DateAdapter<D>,
    @Inject(MAT_DATE_FORMATS) private _dateFormats: MatDateFormats,
    cdr: ChangeDetectorRef
  ) {
    _calendar.stateChanges.pipe(takeUntil(this.destroy$)).subscribe(() => cdr.markForCheck());
  }

  public get periodLabel(): string {
    return this._dateAdapter.format(this._calendar.activeDate, this._dateFormats.display.monthYearLabel).toLocaleUpperCase();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public previousClicked(mode: string): void {
    this._calendar.activeDate = this._dateAdapter.addCalendarMonths(this._calendar.activeDate, -1);
  }

  public nextClicked(mode: string): void {
    this._calendar.activeDate = this._dateAdapter.addCalendarMonths(this._calendar.activeDate, 1);
  }
}
