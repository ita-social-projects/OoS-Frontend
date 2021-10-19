<<<<<<< HEAD
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Actions, ofAction, Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { WorkingDays } from 'src/app/shared/enum/enumUA/working-hours';
import { WorkingTime } from 'src/app/shared/enum/working-hours';
import { WorkingHours } from 'src/app/shared/models/workingHours.model';

import { SetWorkingDays, SetWorkingHours, ClearFilter } from 'src/app/shared/store/filter.actions';
import { FilterState } from 'src/app/shared/store/filter.state';
=======
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngxs/store';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, takeUntil } from 'rxjs/operators';
import { Constants, WorkingDaysValues } from 'src/app/shared/constants/constants';
import { WorkingDaysReverse } from 'src/app/shared/enum/enumUA/working-hours';
import { WorkingDaysToggleValue } from 'src/app/shared/models/workingHours.model';
import { SetEndTime, SetStartTime, SetWorkingDays } from 'src/app/shared/store/filter.actions';
>>>>>>> develop

@Component({
  selector: 'app-working-hours',
  templateUrl: './working-hours.component.html',
  styleUrls: ['./working-hours.component.scss']
})
export class WorkingHoursComponent implements OnInit, OnDestroy {

<<<<<<< HEAD
  @Select(FilterState.workingHours)
  workingHours$: Observable<WorkingHours[]>;

  destroy$: Subject<boolean> = new Subject<boolean>();
  selectedWorkingHours: WorkingHours[] = [];
  selectedWorkingDays: WorkingHours[] = [];

  days: WorkingHours[] = [
    {
      value: WorkingDays.monday,
      selected: false,
    },
    {
      value: WorkingDays.tuesday,
      selected: false,
    },
    {
      value: WorkingDays.wednesday,
      selected: false,
    },
    {
      value: WorkingDays.thursday,
      selected: false,
    },
    {
      value: WorkingDays.friday,
      selected: false,
    },
    {
      value: WorkingDays.saturday,
      selected: false,
    },
    {
      value: WorkingDays.sunday,
      selected: false,
    }
  ];
=======
  readonly constants: typeof Constants = Constants;
  readonly workingDaysReverse: typeof WorkingDaysReverse = WorkingDaysReverse;
  days: WorkingDaysToggleValue[] = WorkingDaysValues;
>>>>>>> develop

  startTimeFormControl = new FormControl('');
  endTimeFormControl = new FormControl('');
  destroy$: Subject<boolean> = new Subject<boolean>();
  selectedWorkingDays: string[] = [];

  constructor(private store: Store,private actions$: Actions,) { }

  ngOnInit(): void {
    this.actions$.pipe(ofAction(ClearFilter))
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        takeUntil(this.destroy$))
      .subscribe(() => {
        this.days = [
          {
            value: WorkingDays.monday,
            selected: false,
          },
          {
            value: WorkingDays.tuesday,
            selected: false,
          },
          {
            value: WorkingDays.wednesday,
            selected: false,
          },
          {
            value: WorkingDays.thursday,
            selected: false,
          },
          {
            value: WorkingDays.friday,
            selected: false,
          },
          {
            value: WorkingDays.saturday,
            selected: false,
          },
          {
            value: WorkingDays.sunday,
            selected: false,
          }
        ];
        this.hours = [
          {
            value: WorkingTime.morning,
            selected: false,
          },
          {
            value: WorkingTime.midday,
            selected: false,
          },
          {
            value: WorkingTime.afternoon,
            selected: false,
          },
          {
            value: WorkingTime.evening,
            selected: false,
          }
        ];
      });

<<<<<<< HEAD
  }
  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
=======
  ngOnInit(): void {
    this.startTimeFormControl.valueChanges.pipe(
      takeUntil(this.destroy$),
      debounceTime(300),
      distinctUntilChanged(),
      filter((time: string) => !!time),
    ).subscribe((time: string) => this.store.dispatch(new SetEndTime(time.split(':')[0])));

    this.endTimeFormControl.valueChanges.pipe(
      takeUntil(this.destroy$),
      debounceTime(300),
      distinctUntilChanged(),
      filter((time: string) => !!time),
    ).subscribe((time: string) => this.store.dispatch(new SetStartTime(time.split(':')[0])));

  }

  getMinTime(): string {
    return this.startTimeFormControl.value ? this.startTimeFormControl.value : this.constants.MAX_TIME;
>>>>>>> develop
  }

  /**
  * This method check value, add it to the list of selected working days and distpatch filter action
  * @param day
  */
  onToggleDays(day: WorkingDaysToggleValue): void {
    day.selected = !day.selected;
    if (day.selected) {
      this.selectedWorkingDays.push(this.workingDaysReverse[day.value])
    } else {
      this.selectedWorkingDays.splice(this.selectedWorkingDays.indexOf(this.workingDaysReverse[day.value]), 1);
    }
    this.store.dispatch(new SetWorkingDays(this.selectedWorkingDays));
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
