import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngxs/store';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil, tap } from 'rxjs/operators';

import { WorkingDaysValues } from 'shared/constants/constants';
import { ValidationConstants } from 'shared/constants/validation';
import { WorkingDaysReverse } from 'shared/enum/enumUA/working-hours';
import { WorkingHoursFilter } from 'shared/models/filter-list.model';
import { WorkingDaysToggleValue } from 'shared/models/working-hours.model';
import { SetEndTime, SetIsAppropriateHours, SetIsStrictWorkdays, SetStartTime, SetWorkingDays } from 'shared/store/filter.actions';
import { TimeFormatValidator } from 'shared/validators/time-format-validator';
import { Util } from 'shared/utils/utils';
import { TimeRangeValidator } from 'shared/validators/time-range-validator';

@Component({
  selector: 'app-working-hours',
  templateUrl: './working-hours.component.html',
  styleUrls: ['./working-hours.component.scss']
})
export class WorkingHoursComponent implements OnInit, OnDestroy {
  public readonly validationConstants = ValidationConstants;
  public readonly workingDaysReverse: typeof WorkingDaysReverse = WorkingDaysReverse;
  public readonly checkBoxDebounceTime: number = 300;
  public readonly inputDebounceTime: number = 500;
  public days: WorkingDaysToggleValue[] = WorkingDaysValues.map((value: WorkingDaysToggleValue) => ({ ...value }));

  public startTimeFormControl = new FormControl('');
  public endTimeFormControl = new FormControl('');
  public isStrictWorkdaysControl = new FormControl(false);
  public isAppropriateHoursControl = new FormControl(false);
  public destroy$: Subject<boolean> = new Subject<boolean>();
  public selectedWorkingDays: string[] = [];
  public workingHoursFormGroup: FormGroup;

  constructor(private readonly store: Store) {}

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
    this.workingHoursFormGroup = new FormGroup({ startTime: this.startTimeFormControl, endTime: this.endTimeFormControl });

    this.endTimeFormControl.setValidators(TimeFormatValidator);
    this.startTimeFormControl.setValidators(TimeFormatValidator);

    this.workingHoursFormGroup.setValidators(TimeRangeValidator('startTime', 'endTime'));

    this.startTimeFormControl.valueChanges
      .pipe(
        tap((value) => this.startTimeFormControl.setValue(Util.formatTimeString(value), { emitEvent: false })),
        debounceTime(this.inputDebounceTime),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.applyFilters();
      });

    this.endTimeFormControl.valueChanges
      .pipe(
        tap((value) => this.endTimeFormControl.setValue(Util.formatTimeString(value), { emitEvent: false })),
        debounceTime(this.inputDebounceTime),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.applyFilters();
      });

    this.isStrictWorkdaysControl.valueChanges
      .pipe(debounceTime(this.checkBoxDebounceTime), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((val: boolean) => this.store.dispatch(new SetIsStrictWorkdays(val)));

    this.isAppropriateHoursControl.valueChanges
      .pipe(debounceTime(this.checkBoxDebounceTime), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((val: boolean) => this.store.dispatch(new SetIsAppropriateHours(val)));
  }

  public onClearTime(formControl: FormControl): void {
    formControl.reset();
  }

  public onTimeSet(chosenTime: string, formControl: FormControl): void {
    formControl.setValue(chosenTime);
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

  private applyFilters(): void {
    if (this.endTimeFormControl.valid) {
      this.store.dispatch(new SetEndTime(this.endTimeFormControl.value || ''));
    }
    if (this.startTimeFormControl.valid) {
      this.store.dispatch(new SetStartTime(this.startTimeFormControl.value || ''));
    }
  }
}
