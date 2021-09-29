import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { WorkshopCard } from 'src/app/shared/models/workshop.model';
import { Util } from 'src/app/shared/utils/utils';

@Component({
  selector: 'app-all-provider-workshops',
  templateUrl: './all-provider-workshops.component.html',
  styleUrls: ['./all-provider-workshops.component.scss']
})
export class AllProviderWorkshopsComponent implements OnInit {

  @Input() providerWorkshops: WorkshopCard[];

  constructor() { }

  ngOnInit(): void {
  }

}
