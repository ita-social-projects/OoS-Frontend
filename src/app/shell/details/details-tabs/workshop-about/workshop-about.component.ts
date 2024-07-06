import { Component, Input } from '@angular/core';

import { WorkingDaysValues } from 'shared/constants/constants';
import { WorkingDays, WorkingDaysReverse } from 'shared/enum/enumUA/working-hours';
import { PayRateTypeEnum } from 'shared/enum/enumUA/workshop';
import { WorkingDaysToggleValue } from 'shared/models/working-hours.model';
import { Workshop } from 'shared/models/workshop.model';

@Component({
  selector: 'app-workshop-about',
  templateUrl: './workshop-about.component.html',
  styleUrls: ['./workshop-about.component.scss']
})
export class WorkshopAboutComponent {
  @Input() public workshop!: Workshop;

  public readonly workingDays = WorkingDays;
  public readonly workingDaysReverse = WorkingDaysReverse;
  public readonly PayRateTypeEnum = PayRateTypeEnum;

  public days: WorkingDaysToggleValue[] = WorkingDaysValues.map((value: WorkingDaysToggleValue) => Object.assign({}, value));
}
