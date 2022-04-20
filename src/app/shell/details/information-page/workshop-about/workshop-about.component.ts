import { Component, Input } from '@angular/core';
import { WorkingDaysValues } from 'src/app/shared/constants/constants';
import { WorkingDays } from 'src/app/shared/enum/enumUA/working-hours';
import { WorkingDaysToggleValue } from 'src/app/shared/models/workingHours.model';
import { Workshop } from 'src/app/shared/models/workshop.model';

@Component({
  selector: 'app-workshop-about',
  templateUrl: './workshop-about.component.html',
  styleUrls: ['./workshop-about.component.scss']
})

export class WorkshopAboutComponent {
  readonly workingDays = WorkingDays;
  @Input() workshop!: Workshop;
  days: WorkingDaysToggleValue[] = WorkingDaysValues.map((value: WorkingDaysToggleValue) => Object.assign({}, value));
 
  isSelected() {
    let i = this.workshop.dateTimeRanges[0].workdays.map(el => this.workingDays[el.toLowerCase()]);
    console.log(i);    
  }
}
