import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { WorkingDaysValues } from 'shared/constants/constants';
import { ValidationConstants } from 'shared/constants/validation';
import { WorkingDaysReverse } from 'shared/enum/enumUA/working-hours';
import { WorkingHoursFilter } from 'shared/models/filter-list.model';
import { WorkingDaysToggleValue } from 'shared/models/working-hours.model';
import { SetEndTime, SetIsAppropriateHours, SetIsStrictWorkdays, SetStartTime, SetWorkingDays } from 'shared/store/filter.actions';

@Component({
  selector: 'app-working-hours',
  templateUrl: './working-hours.component.html',
  styleUrls: ['./working-hours.component.scss']
})
export class WorkingHoursComponent implements OnInit, OnDestroy {
  public minTime: string;
  public maxTime: string;

  public isFree$: Observable<boolean>;

  public readonly validationConstants = ValidationConstants;
  public readonly workingDaysReverse: typeof WorkingDaysReverse = WorkingDaysReverse;
  public days: WorkingDaysToggleValue[] = WorkingDaysValues.map((value: WorkingDaysToggleValue) => ({ ...value }));

  public startTimeFormControl = new FormControl('');
  public endTimeFormControl = new FormControl('');
  public isStrictWorkdaysControl = new FormControl(false);
  public isAppropriateHoursControl = new FormControl(false);
  public destroy$: Subject<boolean> = new Subject<boolean>();
  public selectedWorkingDays: string[] = [];

  constructor(private store: Store) {}

  @Input()
  public set workingHours(filter: WorkingHoursFilter) {
    const { startTime, endTime } = filter;
    const { workingDays, isStrictWorkdays, isAppropriateHours } = filter;

    this.selectedWorkingDays = workingDays;
    this.days.forEach((day) => {
      day.selected = this.selectedWorkingDays.some((el) => el === this.workingDaysReverse[day.value]);
    });
    this.endTimeFormControl.setValue(endTime, { emitEvent: false });
    this.startTimeFormControl.setValue(startTime, { emitEvent: false });
    this.isStrictWorkdaysControl.setValue(isStrictWorkdays, { emitEvent: false });
    this.isAppropriateHoursControl.setValue(isAppropriateHours, { emitEvent: false });
  }

  public ngOnInit(): void {
    this.startTimeFormControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((time: string) => {
        this.store.dispatch(new SetStartTime(time));
        this.minTime = this.startTimeFormControl.value ? this.startTimeFormControl.value : ValidationConstants.MIN_TIME;
      });

    this.endTimeFormControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((time: string) => {
        this.store.dispatch(new SetEndTime(time));
        this.maxTime = this.endTimeFormControl.value ? this.endTimeFormControl.value : ValidationConstants.MAX_TIME;
      });

    this.isStrictWorkdaysControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((val: boolean) => this.store.dispatch(new SetIsStrictWorkdays(val)));

    this.isAppropriateHoursControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((val: boolean) => this.store.dispatch(new SetIsAppropriateHours(val)));
  }

  public clearStart(): void {
    this.startTimeFormControl.reset();
  }

  public clearEnd(): void {
    this.endTimeFormControl.reset();
  }

  /**
   * This method check value, add it to the list of selected working days and distpatch filter action
   * @param day WorkingDaysToggleValue
   */
  public onToggleDays(day: WorkingDaysToggleValue): void {
    day.selected = !day.selected;
    if (day.selected) {
      this.selectedWorkingDays.push(this.workingDaysReverse[day.value]);
    } else {
      this.selectedWorkingDays.splice(this.selectedWorkingDays.indexOf(this.workingDaysReverse[day.value]), 1);
    }
    this.store.dispatch(new SetWorkingDays(this.selectedWorkingDays));
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
