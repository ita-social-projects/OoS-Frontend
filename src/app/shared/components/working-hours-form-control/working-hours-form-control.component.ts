import { Component, OnInit } from '@angular/core';
import { Constants } from '../../constants/constants';
import { WorkingDays, WorkingTime } from '../../enum/working-hours';
import { WorkingHours } from '../../models/workingHours.model';

@Component({
  selector: 'app-working-hours-form-control',
  templateUrl: './working-hours-form-control.component.html',
  styleUrls: ['./working-hours-form-control.component.scss']
})
export class WorkingHoursFormControlComponent implements OnInit {

  readonly constants: typeof Constants = Constants;


  selectedWorkingDay: WorkingHours;

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

  ngOnInit(): void { }

  /**
  * This method check value, add it to the list of selected working days and distpatch filter action
  * @param day
  */
  onToggleDays(day: WorkingHours): void {
    for (let i = 0; i < this.days.length; i++) {
      if (this.days[i].value === day.value) {
        this.days[i].selected = true;
        this.selectedWorkingDay = day;
      } else {
        this.days[i].selected = false;
      }
    }
    console.log(this.selectedWorkingDay)
  }
}
