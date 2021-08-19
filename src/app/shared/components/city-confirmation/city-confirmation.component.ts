import { CleanCity } from './../../store/filter.actions';
import { Store } from '@ngxs/store';
import { Component } from '@angular/core';
import { ConfirmCity } from '../../store/filter.actions';
import { City } from '../../models/city.model';

const kiev: City = {
  district: "м.Київ",
  id: 14446,
  longitude: 30.5595,
  latitude: 50.44029,
  name: "КИЇВ",
  region: "м.Київ"
}

@Component({
  selector: 'app-city-confirmation',
  templateUrl: './city-confirmation.component.html',
  styleUrls: ['./city-confirmation.component.scss']
})
export class CityConfirmationComponent {

  constructor(public store: Store) { }

  confirmCity(): void {
    localStorage.setItem('cityConfirmation', JSON.stringify(kiev));
    this.store.dispatch(new ConfirmCity(false));
  }

  changeCity(): void {
    this.store.dispatch([new ConfirmCity(false), new CleanCity()]);
  }

}
