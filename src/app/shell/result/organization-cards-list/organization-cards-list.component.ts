import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { FilterState } from '../../../shared/store/filter.state';
import { GetWorkshops } from '../../../shared/store/filter.actions';
import { Workshop } from '../../../shared/models/workshop.model';


@Component({
  selector: 'app-organization-cards-list',
  templateUrl: './organization-cards-list.component.html',
  styleUrls: ['./organization-cards-list.component.scss']
})
export class OrganizationCardsListComponent implements OnInit {

  @Select(FilterState.orgCards) orgCards$: Observable<Workshop[]>;

  public cards: Workshop[];
  currentPage: number = 1;

  constructor(private store: Store) {
  }

  ngOnInit(): void {
    this.store.dispatch(new GetWorkshops())
    this.orgCards$.subscribe((orgCards: Workshop[]) => this.cards = orgCards)
  }
}
