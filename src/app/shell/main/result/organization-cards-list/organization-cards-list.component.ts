import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, of } from 'rxjs';

import { orgCard, ORGCARDS } from 'src/app/mock-org-cards';
import { getCards } from 'src/app/shared/store/filter.actions';
import { FilterStateModel } from 'src/app/shared/store/filter.state';

@Component({
  selector: 'app-organization-cards-list',
  templateUrl: './organization-cards-list.component.html',
  styleUrls: ['./organization-cards-list.component.scss']
})
export class OrganizationCardsListComponent implements OnInit {
  public cards: orgCard[];

  @Select() filter$: Observable<FilterStateModel>

  constructor(private store: Store) {}
  
  ngOnInit(): void {
    this.store.dispatch(new getCards())
    this.filter$.subscribe(filter => this.cards = filter.organizationCards)
  }

}
