import { Component, OnDestroy, OnInit } from '@angular/core';
import {Select, Store } from '@ngxs/store';
import { Constants } from 'src/app/shared/constants/constants';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { SetMaxAge, SetMinAge } from 'src/app/shared/store/filter.actions';
import { FilterState } from 'src/app/shared/store/filter.state';
@Component({
  selector: 'app-age-filter',
  templateUrl: './age-filter.component.html',
  styleUrls: ['./age-filter.component.scss']
})
export class AgeFilterComponent implements OnInit, OnDestroy {

  readonly constants: typeof Constants = Constants;
  @Select(FilterState.minAge)
  minAge$: Observable<number>;
  @Select(FilterState.maxAge)
  maxAge$: Observable<number>;

  minAgeFormControl = new FormControl('');
  maxAgeFormControl = new FormControl('');
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.minAge$.pipe(takeUntil(this.destroy$)).subscribe(age => this.minAgeFormControl.setValue(age))
    this.maxAge$.pipe(takeUntil(this.destroy$)).subscribe(age => this.maxAgeFormControl.setValue(age))

    this.minAgeFormControl.valueChanges.pipe(
      takeUntil(this.destroy$),
      debounceTime(300),
      distinctUntilChanged(),
      filter((age: number) => !!age)
    ).subscribe((age: number) => this.store.dispatch(new SetMinAge(age)));

    this.maxAgeFormControl.valueChanges.pipe(
      takeUntil(this.destroy$),
      debounceTime(300),
      distinctUntilChanged(),
      filter((age: number) => !!age)
    ).subscribe((age: number) => this.store.dispatch(new SetMaxAge(age)));

  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
