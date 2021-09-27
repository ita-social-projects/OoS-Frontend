import { Component, Input, OnInit } from '@angular/core';
import { Provider } from 'src/app/shared/models/provider.model';
import { Workshop, WorkshopCard } from 'src/app/shared/models/workshop.model';

@Component({
  selector: 'app-workshop-page',
  templateUrl: './workshop-page.component.html',
  styleUrls: ['./workshop-page.component.scss']
})
export class WorkshopPageComponent implements OnInit {

  @Input() workshop: Workshop;
  @Input() provider: Provider;
  @Input() providerWorkshops: WorkshopCard[];
  @Input() isDisplayedforProvider: boolean;
  @Input() isRegistered: boolean;

  constructor() { }

  ngOnInit(): void { }
}
