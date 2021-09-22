import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Actions, ofAction, ofActionCompleted, ofActionSuccessful, Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, first, map, startWith, takeUntil } from 'rxjs/operators';
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
export class CityAutocompleteComponent implements OnInit {

  @Output() selectedCity = new EventEmitter();
  @Input() InitialCity: string;

  cityFormControl = new FormControl();
  cities: City[] = [];
  destroy$: Subject<boolean> = new Subject<boolean>();

  @Select(MetaDataState.isCity)
  isCity$: Observable<boolean[]>;
  @Select(MetaDataState.cities)
  cities$: Observable<City[]>;

  constructor(public store: Store, private actions$: Actions) { }

  displayCityName(city: City): string {
    return city?.name;
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

    this.InitialCity && this.setInitialAcity();
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

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  setInitialAcity(): void {
    this.cityFormControl.setValue(this.InitialCity);
    this.actions$.pipe(ofActionSuccessful(GetCities))
      .pipe(first())
      .subscribe(() => {
        this.cityFormControl.setValue(this.cities[0])
      });
  }

}
