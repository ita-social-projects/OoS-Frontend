import { Select, Store } from '@ngxs/store';
import { Component } from '@angular/core';
import { ConfirmCity } from '../../../../store/filter.actions';
import { SetFocusOnCityField } from '../../../../store/app.actions';
import { Observable } from 'rxjs';
import { FilterState } from '../../../../store/filter.state';
import { Codeficator } from 'src/app/shared/models/codeficator.model';

@Component({
  selector: 'app-city-confirmation',
  templateUrl: './city-confirmation.component.html',
  styleUrls: ['./city-confirmation.component.scss']
})
export class CityConfirmationComponent {
  @Select(FilterState.settlement)
  settlement$: Observable<Codeficator>;

  isDispalyed = true;

  constructor(public store: Store) { }

  confirmCity(): void {
    this.store.dispatch(new ConfirmCity(true));
  }

  changeCity(): void {
    this.store.dispatch([new ConfirmCity(false), new SetFocusOnCityField()]);
  }
}
