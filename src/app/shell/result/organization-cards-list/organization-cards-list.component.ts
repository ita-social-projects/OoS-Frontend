import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { FilterState } from '../../../shared/store/filter.state';
import { orgCard } from '../../../shared/models/org-card.model';
import { GetWorkshops } from '../../../shared/store/filter.actions';


@Component({
  selector: 'app-organization-cards-list',
  templateUrl: './organization-cards-list.component.html',
  styleUrls: ['./organization-cards-list.component.scss']
})
export class OrganizationCardsListComponent implements OnInit {

  @Select(FilterState.orgCards) orgCards$: Observable<orgCard[]>;

  public cards: orgCard[];

  constructor(private store: Store) {
  }

  ngOnInit(): void {
    this.store.dispatch(new GetWorkshops())
    this.orgCards$.subscribe((orgCards: orgCard[]) => this.cards = orgCards)
  }
}
