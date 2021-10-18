import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Actions, ofAction, ofActionCompleted, ofActionSuccessful, Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, first, last, map, startWith, takeUntil } from 'rxjs/operators';
import { MetaDataState } from '../../store/meta-data.state';
import { ClearCities, GetCities } from '../../store/meta-data.actions';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { City } from '../../models/city.model';
import { FilterState } from '../../store/filter.state';

@Component({
  selector: 'app-city-autocomplete',
  templateUrl: './city-autocomplete.component.html',
  styleUrls: ['./city-autocomplete.component.scss']
})
export class CityAutocompleteComponent implements OnInit, OnDestroy {

  _InitialCity: string;

  @Output() selectedCity = new EventEmitter();
  @Input() set InitialCity(value: string) {
    this._InitialCity = value;
    this._InitialCity && this.setInitialCity();
  }
  @Input() className: string;


  cityFormControl = new FormControl();
  cities: City[] = [];
  destroy$: Subject<boolean> = new Subject<boolean>();

  @Select(MetaDataState.isCity)
  isCity$: Observable<boolean[]>;
  @Select(MetaDataState.cities)
  cities$: Observable<City[]>;

  constructor(public store: Store, private actions$: Actions) { }

  displayCityName(city: City): string {
    return typeof city === 'string' ? city : city?.name;
  }

  ngOnInit(): void {
    this.cities$
      .pipe(
        takeUntil(this.destroy$),
      ).subscribe((cities) => this.cities = cities);

    this.cityFormControl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(500),
        distinctUntilChanged(),
        startWith(''),
        map((value: string) => {
          !value?.length && this.store.dispatch(new ClearCities());
          return value;
        }),
        filter(value => value?.length > 2)
      ).subscribe(value => this.store.dispatch(new GetCities(value)));

    this._InitialCity && this.setInitialCity();
  }
  /**
   * This method selects an option from the list of filtered cities as a chosen city
   * and pass this value to teh parent component
   * @param MatAutocompleteSelectedEvent value
   */
  onSelect(event: MatAutocompleteSelectedEvent): void {
    this.selectedCity.emit(event.option.value);
    this.store.dispatch(new ClearCities());
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  /**
  * This method set initial city to autocomplete
  */
  setInitialCity(): void {
    if (this._InitialCity !== 'Такого міста немає') {
      this.cityFormControl.setValue(this._InitialCity);
      this.actions$.pipe(ofActionSuccessful(GetCities))
        .pipe(last())
        .subscribe(() => {
          this.cities && this.cityFormControl.setValue(this.cities[0]);
        });
    }
  }

}
