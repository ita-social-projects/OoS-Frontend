import { Component, Input } from '@angular/core';
import { WorkingDaysValues } from 'src/app/shared/constants/constants';
import { WorkingDays, WorkingDaysReverse } from 'src/app/shared/enum/enumUA/working-hours';
import { WorkingDaysToggleValue } from 'src/app/shared/models/workingHours.model';
import { Workshop } from 'src/app/shared/models/workshop.model';

@Component({
  selector: 'app-workshop-about',
  templateUrl: './workshop-about.component.html',
  styleUrls: ['./workshop-about.component.scss']
})

export class WorkshopAboutComponent {
  readonly workingDays = WorkingDays;
  readonly workingDaysReverse = WorkingDaysReverse;
  @Input() workshop!: Workshop;
  days: WorkingDaysToggleValue[] = WorkingDaysValues
    .map((value: WorkingDaysToggleValue) => Object.assign({}, value));
}
