import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { FilterState } from '../../../shared/store/filter.state';
import { Workshop } from '../../../shared/models/workshop.model';
import { AppState } from 'src/app/shared/store/app.state';
import { GetWorkshops } from 'src/app/shared/store/app.actions';
import { Role } from 'src/app/shared/enum/role';

@Component({
  selector: 'app-workshop-cards-list',
  templateUrl: './workshop-cards-list.component.html',
  styleUrls: ['./workshop-cards-list.component.scss']
})
export class WorkshopCardsListComponent implements OnInit {

  @Input() workshops: Workshop[];

  currentPage: number = 1;

  constructor(private store: Store) {
  }

  ngOnInit(): void {
    this.store.dispatch(new GetWorkshops());
  }
}
