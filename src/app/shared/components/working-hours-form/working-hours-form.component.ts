import { ValidationConstants } from './../../constants/validation';
import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { Constants, WorkingDaysValues } from '../../constants/constants';
import { WorkingDaysReverse } from '../../enum/enumUA/working-hours';
import { DateTimeRanges, WorkingDaysToggleValue } from '../../models/workingHours.model';

@Component({
  selector: 'app-working-hours-form',
  templateUrl: './working-hours-form.component.html',
  styleUrls: ['./working-hours-form.component.scss']
})
export class WorkingHoursFormComponent implements OnInit, OnDestroy {
  readonly workingDaysReverse: typeof WorkingDaysReverse = WorkingDaysReverse;
  destroy$: Subject<boolean> = new Subject<boolean>();

  days: WorkingDaysToggleValue[] = WorkingDaysValues.map((value: WorkingDaysToggleValue) => Object.assign({}, value));
  workingDays: string[] = [];

  @Input() workingHoursForm: FormGroup;
  @Input() index: number;
  @Input() workingHoursAmount: number;

  @Output() deleteWorkingHour = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
    this.workingHoursForm.value?.workdays.length && this.activateEditMode();
  }

  /**
   * This method check value, add it to the list of selected working days and distpatch filter action
   * @param day WorkingDaysToggleValue
   */
  onToggleDays(day: WorkingDaysToggleValue): void {
    day.selected = !day.selected;
    if (day.selected) {
      this.workingDays.push(this.workingDaysReverse[day.value]);
    } else {
      this.workingDays.splice(this.workingDays.indexOf(day.value), 1);
    }
    this.workingHoursForm.get('workdays').setValue(this.workingDays);
    this.workingHoursForm.get('workdays').markAllAsTouched();
  }

  getMinTime(): string {
    return this.workingHoursForm.get('startTime').value ? this.workingHoursForm.get('startTime').value : ValidationConstants.MAX_TIME;
  }

  delete(): void {
    this.deleteWorkingHour.emit(this.index);
  }

  activateEditMode(): void {
    this.days.forEach((day: WorkingDaysToggleValue) => {
      this.workingHoursForm.value.workdays.forEach((workDay: string) => {
        if (this.workingDaysReverse[day.value] === workDay.toLowerCase()) {
          day.selected = true;
          this.workingDays.push(day.value);
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
