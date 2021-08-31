import { Component, OnInit, OnDestroy } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { City } from 'src/app/shared/models/city.model';
import { FilterState } from 'src/app/shared/store/filter.state';
import { SetCity } from '../../../store/filter.actions';

@Component({
  selector: 'app-city-filter',
  templateUrl: './city-filter.component.html',
  styleUrls: ['./city-filter.component.scss']
})
export class CityFilterComponent implements OnInit, OnDestroy {
  @Select(FilterState.city)
  city$: Observable<City>;
  destroy$: Subject<boolean> = new Subject<boolean>();
  initialCity: City;

  constructor(private store: Store) { }

  ngOnInit(): void { 
    this.city$
    .pipe(takeUntil(this.destroy$))
    .subscribe(city => this.initialCity = city);
  }

  onSelectedCity(event): void {
    this.store.dispatch(new SetCity(event))
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
