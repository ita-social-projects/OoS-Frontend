import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Workshop } from '../../../shared/models/workshop.model';
import { ChangePage } from '../../../shared/store/app.actions';
import { GetActivitiesCards } from '../../../shared/store/provider.actions';
import { ProviderState } from '../../../shared/store/provider.state';

@Component({
  selector: 'app-provider-activities',
  templateUrl: './provider-activities.component.html',
  styleUrls: ['./provider-activities.component.scss']
})
export class ProviderActivitiesComponent implements OnInit {


  @Select(ProviderState.activitiesList)
  cards$: Observable<Workshop[]>;
  public cards: Workshop[];

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(new ChangePage(false));
    this.store.dispatch(new GetActivitiesCards())
    this.cards$.subscribe(cards =>
      this.cards = cards
    );
  }
}
