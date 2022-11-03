import { Component, Input } from '@angular/core';
import { WorkingDaysValues } from '../../../../shared/constants/constants';
import { WorkingDays, WorkingDaysReverse } from '../../../../shared/enum/enumUA/working-hours';
import { PayRateTypeUkr } from '../../../../shared/enum/enumUA/workshop';
import { WorkingDaysToggleValue } from '../../../../shared/models/workingHours.model';
import { Workshop } from '../../../../shared/models/workshop.model';

@Component({
  selector: 'app-workshop-about',
  templateUrl: './workshop-about.component.html',
  styleUrls: ['./workshop-about.component.scss']
})
export class WorkshopAboutComponent {
  readonly workingDays = WorkingDays;
  readonly workingDaysReverse = WorkingDaysReverse;
  readonly PayRateTypeUkr = PayRateTypeUkr;

  @Input() workshop!: Workshop;
  days: WorkingDaysToggleValue[] = WorkingDaysValues.map((value: WorkingDaysToggleValue) => Object.assign({}, value));
}
