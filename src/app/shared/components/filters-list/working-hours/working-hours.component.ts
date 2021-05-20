import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { WorkingDays, WorkingTime } from 'src/app/shared/enum/working-hours';
import { WorkingHours } from 'src/app/shared/models/workingHours.model';
import { SetWorkingDays, SetWorkingHours } from 'src/app/shared/store/filter.actions';

@Component({
  selector: 'app-working-hours',
  templateUrl: './working-hours.component.html',
  styleUrls: ['./working-hours.component.scss']
})
export class WorkingHoursComponent implements OnInit {

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

  hours: WorkingHours[] = [
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

  constructor(private store: Store) { }

  ngOnInit(): void { }

  /**
  * This method check value, add it to the list of selected working days and distpatch filter action
  * @param day
  */
  onToggleDays(day: WorkingHours): void {
    day.selected = !day.selected;
    if (day.selected) {
      this.selectedWorkingDays.push(day)
    } else {
      this.selectedWorkingDays.splice(this.selectedWorkingDays.indexOf(day), 1);
    }
    this.store.dispatch(new SetWorkingDays(this.selectedWorkingDays));
  }

  /**
  * This method check value, add it to the list of selected working hours and distpatch filter action
  * @param time
  */
  onToggleHours(hour: WorkingHours): void {
    hour.selected = !hour.selected;
    if (hour.selected) {
      this.selectedWorkingHours.push(hour)
    } else {
      this.selectedWorkingHours.splice(this.selectedWorkingHours.indexOf(hour), 1);
    }
    this.store.dispatch(new SetWorkingHours(this.selectedWorkingHours));
  }
}
