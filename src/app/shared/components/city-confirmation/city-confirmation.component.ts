import { Constants } from 'src/app/shared/constants/constants';
import { Store } from '@ngxs/store';
import { Component } from '@angular/core';
import { ConfirmCity } from '../../store/filter.actions';
import { SetFocusOnCityField } from '../../store/app.actions';
import { City } from '../../models/city.model';

@Component({
  selector: 'app-city-confirmation',
  templateUrl: './city-confirmation.component.html',
  styleUrls: ['./city-confirmation.component.scss']
})
export class CityConfirmationComponent {
  city: City = JSON.parse(localStorage.getItem('cityConfirmation') as string);

  constructor(public store: Store) { }

  confirmCity(): void {
    this.city.name === 'Київ' 
      ? localStorage.setItem('cityConfirmation', JSON.stringify(Constants.KIEV)) 
      : localStorage.setItem('cityConfirmation', JSON.stringify(this.city as City))
    this.store.dispatch(new ConfirmCity(false));
  }

  changeCity(): void {
    this.store.dispatch([new ConfirmCity(false), new SetFocusOnCityField()]);
  }
}
