import { Component, Input, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { orgCard } from '../../../shared/models/org-card.model';

import { getCards } from '../../../shared/store/filter.actions';
import { FilterState } from '../../../shared/store/filter.state';



@Component({
  selector: 'app-provider-activities',
  templateUrl: './provider-activities.component.html',
  styleUrls: ['./provider-activities.component.scss']
})
export class ProviderActivitiesComponent implements OnInit {

  @Select(FilterState.orgCards) orgCard$: Observable<orgCard[]>;
  public cards: orgCard[];

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(new getCards())
    this.orgCard$.subscribe((orgCards: orgCard[]) => this.cards = orgCards)
  }
}
