import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Constants } from 'src/app/shared/constants/constants';
import { Role } from 'src/app/shared/enum/role';
import { WorkshopCard } from 'src/app/shared/models/workshop.model';
import { Util } from 'src/app/shared/utils/utils';

@Component({
  selector: 'app-all-provider-workshops',
  templateUrl: './all-provider-workshops.component.html',
  styleUrls: ['./all-provider-workshops.component.scss']
})
export class AllProviderWorkshopsComponent implements OnInit {

  readonly Role = Role;
  @Input() role: string;
  @Input() providerWorkshops: WorkshopCard[];
  getEmptyCards = Util.getEmptyCards;
  @ViewChild('WorkshopsWrap') workshopsWrap: ElementRef;
  widthOfWorkshopCard = Constants.WIDTH_OF_WORKSHOP_CARD_IN_WORKSHOP_DETAILS;
  constructor() { }

  ngOnInit(): void {
  }

}
