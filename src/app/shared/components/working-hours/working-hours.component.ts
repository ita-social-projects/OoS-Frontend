import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-working-hours',
  templateUrl: './working-hours.component.html',
  styleUrls: ['./working-hours.component.scss']
})
export class WorkingHoursComponent implements OnInit {
  days: string[] = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];
  hours: string[] = ['08-12', '12-16', '16-18', '18-22'];
  workingDaysControl = new FormControl();
  workingHoursControl = new FormControl();
  isToggleDay: boolean = false;
  isToggleTime: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }
  onToggleDay(): void {
    this.isToggleDay = !this.isToggleDay
    console.log(this.isToggleDay)
  }
  onToggleTime(): void {
    this.isToggleTime = !this.isToggleTime
  }

}
