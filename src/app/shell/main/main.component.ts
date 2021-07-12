import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { GetTopWorkshops } from 'src/app/shared/store/filter.actions';
import { FilterState } from 'src/app/shared/store/filter.state';
import { RegistrationState } from '../../shared/store/registration.state';
import { Direction } from 'src/app/shared/models/category.model';
import { MetaDataState } from 'src/app/shared/store/meta-data.state';
import { Workshop } from '../../shared/models/workshop.model';
import { GetDirections } from 'src/app/shared/store/meta-data.actions';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],

})

export class MainComponent implements OnInit {
  @Select(FilterState.topWorkshops)
  topWorkshops$: Observable<Workshop[]>;
  @Select(RegistrationState.isAuthorized)
  isAuthorized$: Observable<boolean>;
  @Select(MetaDataState.directions)
  directions$: Observable<Direction[]>;

  constructor(private store: Store) {
    // this.topWorkshops$.subscribe((topWorkshops:Workshop[])=>
    // {
    // (topWorkshops.length) ? this.store.dispatch(new ToggleLoading(false)):this.store.dispatch(new ToggleLoading(true))});
   }
   

  ngOnInit(): void {
    this.store.dispatch([
      new GetDirections(),
      new GetTopWorkshops(),
    ]);
   
  }
}
