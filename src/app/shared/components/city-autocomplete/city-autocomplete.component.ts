import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, startWith, takeUntil } from 'rxjs/operators';
import { MetaDataState } from '../../store/meta-data.state';
import { CityList, GetCities } from '../../store/meta-data.actions';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { City } from '../../models/city.model';

const noCity: City = {
  id: null,
  name: 'Такого міста немає'
} as City;

@Component({
  selector: 'app-city-autocomplete',
  templateUrl: './city-autocomplete.component.html',
  styleUrls: ['./city-autocomplete.component.scss']
})
export class CityAutocompleteComponent implements OnInit {

  @Output() selectedCity = new EventEmitter();

  city: City;
  cityControl = new FormControl();
  cities: City[] = [];
  noCity = false;
  destroy$: Subject<boolean> = new Subject<boolean>();

  @Select(MetaDataState.cities)
  cities$: Observable<City[]>;
  @Select(MetaDataState.filteredCities)
  filteredCities$: Observable<City[]>;

  constructor(public store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(new GetCities());

    this.cities$
      .pipe(
        takeUntil(this.destroy$),
      ).subscribe((cities) => this.cities = cities);

    this.cityControl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        distinctUntilChanged(),
        startWith(''),
      ).subscribe(value =>
        value ? this.store.dispatch(new CityList(this._filter(value))) : this.store.dispatch(new CityList([]))
      );
  }

  /**
   * This method filters the list of all cities according to the value of input;
   * If the input value does not match with options
   * the further selection is disabled and a user receive "Такого міста немає"
   * @param string value
   * @returns string[]
   */
  private _filter(value: string): City[] {
    const filteredCities = this.cities
      .filter(c => c.name
        .toLowerCase()
        .startsWith(value.toLowerCase())
      )
      .map(c => c);

    this.noCity = Boolean(filteredCities.length);
    return this.noCity ? [noCity] : filteredCities;
  }

  /**
   * This method selects an option from the list of filtered cities as a chosen city
   * and pass this value to teh parent component
   * @param MatAutocompleteSelectedEvent value
   */
  onSelect(event: MatAutocompleteSelectedEvent): void {
    this.selectedCity.emit(event.option.value);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
