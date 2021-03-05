import { Component, OnInit } from '@angular/core';
import { ProviderActivitiesService } from 'src/app/shared/services/provider-activities/provider-activities.service';
import { actCard } from '../../../shared/models/activities-card.model';



@Component({
  selector: 'app-provider-activities',
  templateUrl: './provider-activities.component.html',
  styleUrls: ['./provider-activities.component.scss']
})
export class ProviderActivitiesComponent implements OnInit {
  public cards: actCard[];

  constructor(private providerActivititesService: ProviderActivitiesService) { }

  ngOnInit(): void {
    this.providerActivititesService.getCards()
      .subscribe((data)=>{
        this.cards=data;
    })
  }
}
