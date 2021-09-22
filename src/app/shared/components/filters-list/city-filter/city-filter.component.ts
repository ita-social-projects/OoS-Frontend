import { Component } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { City } from 'src/app/shared/models/city.model';
import { FilterState } from 'src/app/shared/store/filter.state';
import { MetaDataState } from 'src/app/shared/store/meta-data.state';
import { SetCity } from '../../../store/filter.actions';

@Component({
  selector: 'app-city-filter',
  templateUrl: './city-filter.component.html',
  styleUrls: ['./city-filter.component.scss']
})
export class CityFilterComponent {

  @Select(FilterState.isConfirmCity)
  isConfirmCity$: Observable<boolean>;
  @Select(FilterState.city)
  city$: Observable<City>;

  constructor(private store: Store) { }

  onSelectedCity(event): void {
    this.store.dispatch(new SetCity(event))
  }

}
