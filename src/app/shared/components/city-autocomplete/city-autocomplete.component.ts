import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Actions, ofAction, ofActionSuccessful, Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, last, map, startWith, takeUntil } from 'rxjs/operators';
import { MetaDataState } from '../../store/meta-data.state';
import { ClearCities, GetCities } from '../../store/meta-data.actions';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { City } from '../../models/city.model';
import { SetFocusOnCityField } from '../../store/app.actions';
import { Constants } from '../../constants/constants';

@Component({
  selector: 'app-city-autocomplete',
  templateUrl: './city-autocomplete.component.html',
  styleUrls: ['./city-autocomplete.component.scss']
})
export class CityAutocompleteComponent implements OnInit, OnDestroy {
  readonly noCity = Constants.NO_CITY;
  @ViewChild('search') searchElement: ElementRef;

  @Input() set InitialCity(value: string) {
    this._InitialCity = value;
    this._InitialCity && this.setInitialCity();
  }
  @Input() className: string;
  @Input() cityFormControl: FormControl = new FormControl();

  @Output() selectedCity = new EventEmitter();
  @Output() passCityFormControl = new EventEmitter();
  @Output() focusout = new EventEmitter();

  @Select(MetaDataState.cities)
  cities$: Observable<City[]>;
  cities: City[] = [];

  destroy$: Subject<boolean> = new Subject<boolean>();

  private _InitialCity: string;

  constructor(private store: Store, private actions$: Actions) { }

  displayCityName(city: City): string {
    return typeof city === 'string' ? city : city?.name;
  }

  ngOnInit(): void {
    this.cities$
      .pipe(takeUntil(this.destroy$))
      .subscribe((cities: City[]) => this.cities = cities);

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

    this.actions$
      .pipe(ofAction(SetFocusOnCityField))
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.setFocus());
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

  /**
   * This method set initial city to autocomplete
   */
  private setInitialCity(): void {
    if (this._InitialCity !== Constants.NO_CITY) {
      this.cityFormControl.setValue(this._InitialCity, { emitEvent: false });
      this.actions$.pipe(ofActionSuccessful(GetCities))
        .pipe(last(), filter((cities: City[])=> !!cities))
        .subscribe(()=> this.cityFormControl.setValue(this.cities[0]));
    }
  }

  /**
   * This method sets focus on input search city
   */
  private setFocus(): void {
    const initialValut = this.searchElement.nativeElement.value;
    this.searchElement.nativeElement.value = '';
    this.searchElement.nativeElement.focus();
    this.searchElement.nativeElement.value = initialValut;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  onFocusout(auto: MatAutocomplete): void {
    this.focusout.emit(auto.options.first?.value);
  }
}
