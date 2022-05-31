import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { debounce, takeUntil, debounceTime } from 'rxjs/operators';
import { City } from 'src/app/shared/models/city.model';
import { FilterState } from 'src/app/shared/store/filter.state';
import { SetCity } from '../../../store/filter.actions';

@Component({
  selector: 'app-city-filter',
  templateUrl: './city-filter.component.html',
  styleUrls: ['./city-filter.component.scss']
})
export class CityFilterComponent implements OnInit, OnDestroy{
  @Select(FilterState.isConfirmCity)
  isConfirmCity$: Observable<boolean>;
  @Select(FilterState.city)
  city$: Observable<City>;
  city: City;

  cityFormControl = new FormControl();
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.city$.pipe(
      debounceTime(1000),
      takeUntil(this.destroy$)
    ).subscribe((city: City) => this.city = city);
  }

  onSelectedCity(city: City): void {
    this.store.dispatch(new SetCity(city));
  }

  OnFocusout(): void {
    this.cityFormControl.setValue(this.city);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
