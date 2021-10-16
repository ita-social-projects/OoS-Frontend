import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { WorkingDays } from 'src/app/shared/enum/enumUA/working-hours';
import { WorkingTime } from 'src/app/shared/enum/working-hours';
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
  minHour:number = 0;
  maxHour:number = 24;
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


  constructor(private store: Store) { }

  ngOnInit(): void {}

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

  onToggleHours(): void {
    let hoursInStringFormat = '';
    if (this.maxHour > this.minHour) {
      if ((this.minHour && this.maxHour)) {
        hoursInStringFormat = this.minHour + '-' + this.maxHour;
      } else if (this.minHour) {
        hoursInStringFormat = this.minHour + '-' + 24;
      }
      else if (this.maxHour) {
        hoursInStringFormat = 0 + '-' + this.maxHour;
      }
    }
    this.selectedWorkingHours = new Array();
    this.selectedWorkingHours.push({ value: hoursInStringFormat, selected: true });
    this.store.dispatch(new SetWorkingHours(this.selectedWorkingHours));
  }
}
