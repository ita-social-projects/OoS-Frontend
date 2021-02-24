import { Component, Input, OnInit } from '@angular/core';
import { activitiesCard } from 'src/app/shared/models/org-card.model';


@Component({
  selector: 'app-provider-activities',
  templateUrl: './provider-activities.component.html',
  styleUrls: ['./provider-activities.component.scss']
})
export class ProviderActivitiesComponent implements OnInit {

  @Input () card: activitiesCard;

  constructor() { }

  ngOnInit(): void {
  }

}
