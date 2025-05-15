import { Component, Input, OnInit } from '@angular/core';

import { WorkingDaysValues } from 'shared/constants/constants';
import { WorkingDays, WorkingDaysReverse } from 'shared/enum/enumUA/working-hours';
import { PayRateTypeEnum } from 'shared/enum/enumUA/workshop';
import { ImgPath } from 'shared/models/carousel.model';
import { WorkingDaysToggleValue } from 'shared/models/working-hours.model';
import { Workshop } from 'shared/models/workshop.model';
import { ImagesService } from 'shared/services/images/images.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-workshop-about',
  templateUrl: './workshop-about.component.html',
  styleUrls: ['./workshop-about.component.scss']
})
export class WorkshopAboutComponent implements OnInit {
  @Input() public workshop!: Workshop;

  public readonly workingDays = WorkingDays;
  public readonly workingDaysReverse = WorkingDaysReverse;
  public readonly PayRateTypeEnum = PayRateTypeEnum;

  public days: WorkingDaysToggleValue[] = WorkingDaysValues.map((value: WorkingDaysToggleValue) => ({ ...value }));

  public images: ImgPath[];

  public get currentLang(): string {
    return this.translateService.currentLang;
  }

  constructor(
    private readonly imagesService: ImagesService,
    private readonly translateService: TranslateService
  ) {}

  public ngOnInit(): void {
    this.images = this.imagesService.getCarouselImages(Object.setPrototypeOf(this.workshop, Workshop.prototype));
  }
}
