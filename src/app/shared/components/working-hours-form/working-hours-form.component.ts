import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Constants } from '../../constants/constants';
import { WorkingDays, WorkingDaysReverse } from '../../enum/enumUA/working-hours';
import { DateTimeRanges, WorkingHours } from '../../models/workingHours.model';

@Component({
  selector: 'app-working-hours-form',
  templateUrl: './working-hours-form.component.html',
  styleUrls: ['./working-hours-form.component.scss']
})
export class WorkingHoursFormComponent implements OnInit {

  readonly constants: typeof Constants = Constants;
  readonly workingDaysReverse: typeof WorkingDaysReverse = WorkingDaysReverse;

  @Input() workingHoursForm: FormGroup;
  @Input() index: number;
  @Input() workingHoursAmount: number;
  @Output() deleteWorkingHour = new EventEmitter();

  workingDays: string[] = [];
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

  constructor() { }

  ngOnInit(): void {
    this.workingHoursForm.value?.workdays.length && this.activateEditMode();

    this.workingHoursForm.valueChanges.subscribe((timeRange: DateTimeRanges) => {
      if (timeRange.startTime > timeRange.endTime && timeRange.endTime) {
        this.workingHoursForm.get('endTime').reset();
      }
    })
  }

  /**
 * This method check value, add it to the list of selected working days and distpatch filter action
 * @param day
 */
  onToggleDays(day: WorkingHours): void {
    day.selected = !day.selected;
    if (day.selected) {
      this.workingDays.push(this.workingDaysReverse[day.value])
    } else {
      this.workingDays.splice(this.workingDays.indexOf(day.value), 1);
    }
    this.workingHoursForm.get('workdays').setValue(this.workingDays)
  }

  getMinTime(): string {
    return this.workingHoursForm.get('startTime').value ? this.workingHoursForm.get('startTime').value : '23:59';
  }

  delete(): void {
    this.deleteWorkingHour.emit();
  }

  activateEditMode(): void {
    this.days.forEach((day: WorkingHours) => {
      this.workingHoursForm.value.workdays.forEach((workDay: string) => {
        if (this.workingDaysReverse[day.value] === workDay.toLowerCase()) {
          day.selected = true;
          this.workingDays.push(day.value);
        }
      })
    });
  }
}
