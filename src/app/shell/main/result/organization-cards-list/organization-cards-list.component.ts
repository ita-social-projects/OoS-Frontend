import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { orgCard } from 'src/app/shared/models/org-card.model';
import { getCards } from 'src/app/shared/store/filter.actions';
import { FilterState } from 'src/app/shared/store/filter.state';

@Component({
  selector: 'app-organization-cards-list',
  templateUrl: './organization-cards-list.component.html',
  styleUrls: ['./organization-cards-list.component.scss']
})
export class OrganizationCardsListComponent implements OnInit {
  public cards: orgCard[];

  @Select(FilterState.orgCards) orgCards$: Observable<orgCard[]>

  constructor(private store: Store) {}
  
  ngOnInit(): void {
    this.store.dispatch(new getCards())
    this.orgCards$.subscribe(orgCards => this.cards = orgCards)
  }

}
