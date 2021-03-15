import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { ProviderActivitiesService } from 'src/app/shared/services/provider-activities/provider-activities.service';
import { ChangePage } from 'src/app/shared/store/app.actions';
import { actCard } from '../../../shared/models/activities-card.model';



@Component({
  selector: 'app-provider-activities',
  templateUrl: './provider-activities.component.html',
  styleUrls: ['./provider-activities.component.scss']
})
export class ProviderActivitiesComponent implements OnInit {
  public cards: actCard[];

  constructor(private providerActivititesService: ProviderActivitiesService, private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(new ChangePage(false));
    this.providerActivititesService.getCards()
      .subscribe((data)=>{
        this.cards=data;
    })
  }
}
