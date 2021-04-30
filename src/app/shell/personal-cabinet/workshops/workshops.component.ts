import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { GetWorkshops } from 'src/app/shared/store/filter.actions';
import { Workshop } from '../../../shared/models/workshop.model';
import { ChangePage } from '../../../shared/store/app.actions';
import { ProviderState } from '../../../shared/store/provider.state';

@Component({
  selector: 'app-workshops',
  templateUrl:'./workshops.component.html',
  styleUrls: ['./workshops.component.scss']
})
export class WorkshopsComponent implements OnInit {


  @Select(ProviderState.workshopsList)
  cards$: Observable<Workshop[]>;
  public cards: Workshop[];

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(new ChangePage(false));
    this.store.dispatch(new GetWorkshops())
  }
}
