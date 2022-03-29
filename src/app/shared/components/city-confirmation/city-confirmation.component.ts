import { Constants } from 'src/app/shared/constants/constants';
import { Select, Store } from '@ngxs/store';
import { Component, OnInit } from '@angular/core';
import { ConfirmCity } from '../../store/filter.actions';
import { SetFocusOnCityField } from '../../store/app.actions';
import { City } from '../../models/city.model';
import { Observable } from 'rxjs';
import { FilterState } from '../../store/filter.state';

@Component({
  selector: 'app-city-confirmation',
  templateUrl: './city-confirmation.component.html',
  styleUrls: ['./city-confirmation.component.scss']
})
export class CityConfirmationComponent {
  city: City;

  @Select(FilterState.city)
  city$: Observable<City>;

  constructor(public store: Store) { }

  confirmCity(): void {    
    this.store.dispatch(new ConfirmCity(true));
  }

  changeCity(): void {
    this.store.dispatch([new ConfirmCity(false), new SetFocusOnCityField()]);
  }
}
