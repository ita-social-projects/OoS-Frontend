import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { SetCity } from '../../../store/filter.actions';

@Component({
  selector: 'app-city-filter',
  templateUrl: './city-filter.component.html',
  styleUrls: ['./city-filter.component.scss']
})
export class CityFilterComponent {

  constructor(private store: Store) { }

  onSelectedCity(event): void {
    this.store.dispatch(new SetCity(event))
  }

}
