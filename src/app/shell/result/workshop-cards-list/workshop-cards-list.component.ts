import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { FilterState } from '../../../shared/store/filter.state';
import { GetWorkshops } from '../../../shared/store/filter.actions';
import { Workshop } from '../../../shared/models/workshop.model';


@Component({
  selector: 'app-workshop-cards-list',
  templateUrl: './workshop-cards-list.component.html',
  styleUrls: ['./workshop-cards-list.component.scss']
})
export class WorkshopCardsListComponent implements OnInit {

  @Select(FilterState.workshopsCards) cards$: Observable<Workshop[]>;

  public workshops: Workshop[];
  currentPage: number = 1;

  constructor(private store: Store) {
  }

  ngOnInit(): void {
    this.store.dispatch(new GetWorkshops())
    this.cards$.subscribe((workshops: Workshop[]) => this.workshops = workshops)
  }
}
