import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { FilterState } from '../../../shared/store/filter.state';
import { Workshop } from '../../../shared/models/workshop.model';
import { AppState } from 'src/app/shared/store/app.state';
import { GetWorkshops } from 'src/app/shared/store/app.actions';


@Component({
  selector: 'app-workshop-cards-list',
  templateUrl: './workshop-cards-list.component.html',
  styleUrls: ['./workshop-cards-list.component.scss']
})
export class WorkshopCardsListComponent implements OnInit {

  @Select(FilterState.filteredlWorkshops) filteredlWorkshops$: Observable<Workshop[]>;
  @Select(AppState.allWorkshops) allWorkshops$: Observable<Workshop[]>;

  public workshops: Workshop[];
  currentPage: number = 1;

  constructor(private store: Store) {
  }

  ngOnInit(): void {
    this.store.dispatch(new GetWorkshops());
    this.allWorkshops$.subscribe((workshops: Workshop[]) => this.workshops = workshops)
  }
}
