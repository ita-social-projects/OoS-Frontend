import { Component, OnInit } from '@angular/core';
import { WorkingHours } from 'src/app/shared/models/workingHours.model';

@Component({
  selector: 'app-working-hours',
  templateUrl: './working-hours.component.html',
  styleUrls: ['./working-hours.component.scss']
})
export class WorkingHoursComponent implements OnInit {
  days: WorkingHours[] = [
    {
      value: 'ПН',
      selected: false,
    },
    {
      value: 'ВТ',
      selected: false,
    },
    {
      value: 'СР',
      selected: false,
    },
    {
      value: 'ЧТ',
      selected: false,
    },
    {
      value: 'ПТ',
      selected: false,
    },
    {
      value: 'СБ',
      selected: false,
    },
    {
      value: 'ВС',
      selected: false,
    }
  ];
  hours: WorkingHours[] = [
    {
      value: '08-12',
      selected: false,
    },
    {
      value: '12-16',
      selected: false,
    },
    {
      value: '16-18',
      selected: false,
    },
    {
      value: '18-22',
      selected: false,
    }
  ];


  constructor() { }

  ngOnInit(): void {
  }

  onToggleDay(value): void {
    value.selected = !value.selected;
  }

  onToggleTime(value): void {
    value.selected = !value.selected;
  }
}
