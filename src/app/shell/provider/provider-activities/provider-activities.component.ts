import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { actCard } from '../../../shared/models/activities-card.model';

import { getActivities } from '../../../shared/store/filter.actions';
import { FilterState } from '../../../shared/store/filter.state';



@Component({
  selector: 'app-provider-activities',
  templateUrl: './provider-activities.component.html',
  styleUrls: ['./provider-activities.component.scss']
})
export class ProviderActivitiesComponent implements OnInit {

  @Select(FilterState.actCards) actCard$: Observable<actCard[]>;
  public cards: actCard[];

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(new getActivities())
    this.actCard$.subscribe((actCards: actCard[]) => this.cards = actCards)
  }
}
