import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Constants, WorkingDaysValues } from '../../constants/constants';
import { WorkingDaysReverse } from '../../enum/enumUA/working-hours';
import { DateTimeRanges, WorkingDaysToggleValue } from '../../models/workingHours.model';

@Component({
  selector: 'app-working-hours-form',
  templateUrl: './working-hours-form.component.html',
  styleUrls: ['./working-hours-form.component.scss']
})
export class WorkingHoursFormComponent implements OnInit {

  readonly constants: typeof Constants = Constants;
  readonly workingDaysReverse: typeof WorkingDaysReverse = WorkingDaysReverse;
  days: WorkingDaysToggleValue[] = WorkingDaysValues.map((value: WorkingDaysToggleValue) => Object.assign({}, value));
  workingDays: string[] = [];

  @Input() workingHoursForm: FormGroup;
  @Input() index: number;
  @Input() workingHoursAmount: number;
  @Output() deleteWorkingHour = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
    this.workingHoursForm.value?.workdays.length && this.activateEditMode();

    this.workingHoursForm.valueChanges.subscribe((timeRange: DateTimeRanges) => {
      if (timeRange.startTime > timeRange.endTime && timeRange.endTime) {
        this.workingHoursForm.get('endTime').reset();
      }
    });
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
  }

  getMinTime(): string {
    return this.workingHoursForm.get('startTime').value ? this.workingHoursForm.get('startTime').value : this.constants.MAX_TIME;
  }

  delete(): void {
    this.deleteWorkingHour.emit();
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
}
