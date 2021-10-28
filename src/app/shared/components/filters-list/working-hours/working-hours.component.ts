import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Constants, WorkingDaysValues } from 'src/app/shared/constants/constants';
import { WorkingDaysReverse } from 'src/app/shared/enum/enumUA/working-hours';
import { WorkingDaysToggleValue } from 'src/app/shared/models/workingHours.model';
import { SetEndTime, SetStartTime, SetWorkingDays } from 'src/app/shared/store/filter.actions';
import { FilterState } from 'src/app/shared/store/filter.state';

@Component({
  selector: 'app-working-hours',
  templateUrl: './working-hours.component.html',
  styleUrls: ['./working-hours.component.scss']
})
export class WorkingHoursComponent implements OnInit, OnDestroy {
  @Select(FilterState.workingDays)
  workingDays$: Observable<string[]>;
  @Select(FilterState.endTime)
  endTime$: Observable<string>;
  @Select(FilterState.startTime)
  startTime$: Observable<string>;


  isFree$: Observable<boolean>;
  @Input() workingHours;
  readonly constants: typeof Constants = Constants;
  readonly workingDaysReverse: typeof WorkingDaysReverse = WorkingDaysReverse;
  days: WorkingDaysToggleValue[] = WorkingDaysValues.map((value: WorkingDaysToggleValue) => Object.assign({}, value));

  startTimeFormControl = new FormControl('');
  endTimeFormControl = new FormControl('');
  destroy$: Subject<boolean> = new Subject<boolean>();
  selectedWorkingDays: string[] = [];

  constructor(private store: Store) { }
  ngOnChanges() {
      let {endTime, startTime, workingDays} = this.workingHours

      this.selectedWorkingDays = workingDays
      this.days.forEach(day => {
        if (this.selectedWorkingDays.some(el => el === this.workingDaysReverse[day.value])) {
          day.selected = true
        } else {
          day.selected = false
        }
      })

      endTime ? endTime=endTime+':00' : endTime
      this.endTimeFormControl.setValue(endTime, {emitEvent: false});

      startTime ? startTime=startTime+':00' : startTime
      this.startTimeFormControl.setValue(startTime, {emitEvent: false});
  }
  ngOnInit(): void {

    this.workingDays$.pipe(
      takeUntil(this.destroy$)
    ).subscribe((value) => {
      this.selectedWorkingDays = value
      this.days.forEach(day => {
        if (this.selectedWorkingDays.some(el => el === this.workingDaysReverse[day.value])) {
          day.selected = true
        } else {
          day.selected = false
        }
      })
    })


    // this.resetFilter$.pipe(
    //   takeUntil(this.destroy$)
    // ).subscribe(() => {
    //   this.startTimeFormControl.setValue('');
    //   this.endTimeFormControl.setValue('');
    //   this.selectedWorkingDays = []
    //   this.days.forEach(day => day.selected = false)
    //   this.store.dispatch(new SetWorkingDays(this.selectedWorkingDays))
    // })

    this.startTimeFormControl.valueChanges.pipe(
      takeUntil(this.destroy$),
      debounceTime(300),
      distinctUntilChanged(),
    ).subscribe((time: string) => this.store.dispatch(new SetStartTime(time.split(':')[0])));

    this.endTimeFormControl.valueChanges.pipe(
      takeUntil(this.destroy$),
      debounceTime(300),
      distinctUntilChanged(),
    ).subscribe((time: string) => this.store.dispatch(new SetEndTime(time.split(':')[0])));

    // this.startTime$.pipe(
    //   takeUntil(this.destroy$)
    // ).subscribe((value) => {
    //   value ? value=value+':00' : value
    //   this.startTimeFormControl.setValue(value, {emitEvent: false});
    // });

    // this.endTime$.pipe(
    //   takeUntil(this.destroy$)
    // ).subscribe((value) => {
    //   value ? value=value+':00' : value
    //   this.endTimeFormControl.setValue(value, {emitEvent: false});
    // });

  }

  getMinTime(): string {
    return this.startTimeFormControl.value ? this.startTimeFormControl.value : this.constants.MAX_TIME;
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
