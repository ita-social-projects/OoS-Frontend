import { Options } from '@angular-slider/ngx-slider';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, } from '@angular/forms';
import { Actions, ofAction, Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, takeUntil } from 'rxjs/operators';
import { Constants } from 'src/app/shared/constants/constants';
import { ClearFilter, SetIsFree, SetMaxPrice, SetMinPrice } from 'src/app/shared/store/filter.actions';
import { FilterState } from 'src/app/shared/store/filter.state';

@Component({
  selector: 'app-price-filter',
  templateUrl: './price-filter.component.html',
  styleUrls: ['./price-filter.component.scss']
})

export class PriceFilterComponent implements OnInit, OnDestroy {

  @Select(FilterState.minPrice)
  minPrice$: Observable<number>;
  @Select(FilterState.maxPrice)
  maxPrice$: Observable<number>;
  @Select(FilterState.isFree)
  isFree$: Observable<boolean>;
  readonly constants: typeof Constants = Constants;

  isFreeControl = new FormControl(false);
  maxPriceControl = new FormControl(0, [Validators.maxLength(4)]);
  minPriceControl = new FormControl(0, [Validators.maxLength(4)]);
  minValue: number = 0;
  maxValue: number = 0;
  options: Options = {
    floor: Constants.MIN_PRICE,
    ceil: Constants.MAX_PRICE,
  };
  destroy$: Subject<boolean> = new Subject<boolean>();


  constructor(private store: Store, private actions$: Actions) { }

  /**
   * On ngOnInit subscribe to input value changes, change type of payment depending on input value and distpatch filter action
   */
  ngOnInit(): void {

    this.minPrice$.pipe(
        takeUntil(this.destroy$)
      ).subscribe(price => {
        this.minValue = price
        this.minPriceControl.setValue(price)
    });

    this.maxPrice$.pipe(
        takeUntil(this.destroy$)
      ).subscribe(price => {
        this.maxValue = price
        this.maxPriceControl.setValue(price)
    });

    this.isFree$.pipe(takeUntil(this.destroy$)).subscribe(boolen => {
      this.isFreeControl.setValue(boolen)
    });

    this.isFreeControl.valueChanges.subscribe((val: boolean) => this.store.dispatch(new SetIsFree(val)));
    this.minPriceControl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        distinctUntilChanged(),
      ).subscribe((val: number) => {
        val ? this.minValue = val : this.isFreeControl.setValue(!!this.minValue);
        this.store.dispatch(new SetMinPrice(val));
      });

    this.maxPriceControl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        distinctUntilChanged()
      ).subscribe((val: number) => {
        this.maxValue = val;
        this.store.dispatch(new SetMaxPrice(val));
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
