import { Constants } from 'src/app/shared/constants/constants';
import { Store } from '@ngxs/store';
import { Component, OnInit } from '@angular/core';
import { ConfirmCity } from '../../store/filter.actions';
import { SetFocusOnCityField } from '../../store/app.actions';
import { City } from '../../models/city.model';

@Component({
  selector: 'app-city-confirmation',
  templateUrl: './city-confirmation.component.html',
  styleUrls: ['./city-confirmation.component.scss']
})
export class CityConfirmationComponent implements OnInit {
  city: City = JSON.parse(localStorage.getItem('cityConfirmation') as string);

  constructor(public store: Store) { }

  ngOnInit() {
    this.city = JSON.parse(localStorage.getItem('cityConfirmation') as string);
  }

  confirmCity(): void {
    this.city.name !== 'Київ' 
      ? localStorage.setItem('cityConfirmation', JSON.stringify(this.city)) 
      : localStorage.setItem('cityConfirmation', JSON.stringify(Constants.KIEV))
    this.store.dispatch(new ConfirmCity(false));
  }

  changeCity(): void {
    this.store.dispatch([new ConfirmCity(false), new SetFocusOnCityField()]);
  }
}
