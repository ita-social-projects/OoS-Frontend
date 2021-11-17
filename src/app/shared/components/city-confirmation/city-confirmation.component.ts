import { Constants } from 'src/app/shared/constants/constants';
import { CleanCity } from './../../store/filter.actions';
import { Store } from '@ngxs/store';
import { Component } from '@angular/core';
import { ConfirmCity } from '../../store/filter.actions';


@Component({
  selector: 'app-city-confirmation',
  templateUrl: './city-confirmation.component.html',
  styleUrls: ['./city-confirmation.component.scss']
})
export class CityConfirmationComponent {

  constructor(public store: Store) { }

  confirmCity(): void {
    localStorage.setItem('cityConfirmation', JSON.stringify(Constants.KIEV));
    this.store.dispatch(new ConfirmCity(false));
  }

  changeCity(): void {
    this.store.dispatch([new ConfirmCity(false), new CleanCity()]);
  }

}
