import { ValidationConstants } from 'src/app/shared/constants/validation';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { WorkingDaysValues } from 'src/app/shared/constants/constants';
import { WorkingDaysReverse } from 'src/app/shared/enum/enumUA/working-hours';
import { WorkingDaysToggleValue } from 'src/app/shared/models/workingHours.model';
import { SetEndTime, SetStartTime, SetWorkingDays } from 'src/app/shared/store/filter.actions';

@Component({
  selector: 'app-working-hours',
  templateUrl: './working-hours.component.html',
  styleUrls: ['./working-hours.component.scss']
})
export class WorkingHoursComponent implements OnInit, OnDestroy {
  public minTime: string;
  public maxTime: string;

  isFree$: Observable<boolean>;
  @Input()
  set workingHours(filter) {
    let { endTime, startTime, workingDays } = filter

    this.selectedWorkingDays = workingDays
    this.days.forEach(day => {
      if (this.selectedWorkingDays.some(el => el === this.workingDaysReverse[day.value])) {
        day.selected = true
      } else {
        day.selected = false
      }
    })

    endTime ? endTime = endTime + ':00' : endTime
    this.endTimeFormControl.setValue(endTime, { emitEvent: false });

    startTime ? startTime = startTime + ':00' : startTime
    this.startTimeFormControl.setValue(startTime, { emitEvent: false });
  };

  readonly validationConstants = ValidationConstants;
  readonly workingDaysReverse: typeof WorkingDaysReverse = WorkingDaysReverse;
  days: WorkingDaysToggleValue[] = WorkingDaysValues.map((value: WorkingDaysToggleValue) => Object.assign({}, value));

  startTimeFormControl = new FormControl('');
  endTimeFormControl = new FormControl('');
  destroy$: Subject<boolean> = new Subject<boolean>();
  selectedWorkingDays: string[] = [];

  constructor(private store: Store) { }

  ngOnInit(): void {

    this.startTimeFormControl.valueChanges.pipe(
      takeUntil(this.destroy$),
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe((time: string) => {
      this.store.dispatch(new SetStartTime(time?.split(':')[0]));
      this.minTime = this.startTimeFormControl.value ? this.startTimeFormControl.value : ValidationConstants.MIN_TIME;
    });

    this.endTimeFormControl.valueChanges.pipe(
      takeUntil(this.destroy$),
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe((time: string) => {
      this.store.dispatch(new SetEndTime(time?.split(':')[0]));
      this.maxTime = this.endTimeFormControl.value ? this.endTimeFormControl.value : ValidationConstants.MAX_TIME;
    });
  }

  clearStart(): void {
    this.startTimeFormControl.reset();
  }

  clearEnd(): void {
    this.endTimeFormControl.reset();
  }

  /**
   * This method check value, add it to the list of selected working days and distpatch filter action
   * @param day WorkingDaysToggleValue
   */
  onToggleDays(day: WorkingDaysToggleValue): void {
    day.selected = !day.selected;
    if (day.selected) {
      this.selectedWorkingDays.push(this.workingDaysReverse[day.value]);
    } else {
      this.selectedWorkingDays.splice(this.selectedWorkingDays.indexOf(this.workingDaysReverse[day.value]), 1);
    }
    this.store.dispatch(new SetWorkingDays(this.selectedWorkingDays));
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
