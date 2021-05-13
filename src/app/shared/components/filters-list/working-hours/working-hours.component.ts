import { Component, OnInit } from '@angular/core';
import { WorkingDays, WorkingTime } from 'src/app/shared/enum/working-hours';
import { WorkingHours } from 'src/app/shared/models/workingHours.model';

@Component({
  selector: 'app-working-hours',
  templateUrl: './working-hours.component.html',
  styleUrls: ['./working-hours.component.scss']
})
export class WorkingHoursComponent implements OnInit {
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

  constructor() { }

  ngOnInit(): void { }

  onToggle(value: WorkingHours): void {
    value.selected = !value.selected;
  }
}
