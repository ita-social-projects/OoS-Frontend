import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ProviderActivitiesService } from 'src/app/shared/services/provider-activities/provider-activities.service';
import { ChangePage } from 'src/app/shared/store/app.actions';
import { GetActivitiesCards } from 'src/app/shared/store/provider.actions';
import { ProviderState } from 'src/app/shared/store/provider.state';
import { actCard } from '../../../shared/models/activities-card.model';

@Component({
  selector: 'app-provider-activities',
  templateUrl: './provider-activities.component.html',
  styleUrls: ['./provider-activities.component.scss']
})
export class ProviderActivitiesComponent implements OnInit {
  

  @Select(ProviderState.activitiesList) 
  cards$: Observable<actCard[]>;
  public cards: actCard[];

  constructor(private providerActivititesService: ProviderActivitiesService, private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(new ChangePage(false));
    this.store.dispatch(new GetActivitiesCards())
    this.cards$.subscribe(cards => 
      this.cards = cards
    );
    console.log(this.cards);
  }
}
