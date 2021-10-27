import { Options } from '@angular-slider/ngx-slider';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, skip, takeUntil } from 'rxjs/operators';
import { Constants } from 'src/app/shared/constants/constants';
import { SetIsFree, SetMaxPrice, SetMinPrice } from 'src/app/shared/store/filter.actions';
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

  @Input() resetFilter$
  readonly constants: typeof Constants = Constants;

  isFreeControl = new FormControl(false);
  maxPriceControl = new FormControl(0, [Validators.maxLength(4)]);
  minPriceControl = new FormControl(0, [Validators.maxLength(4)]);
  minValue = 0;
  maxValue = 0;
  options: Options = {
    floor: Constants.MIN_PRICE,
    ceil: Constants.MAX_PRICE,
  };
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private store: Store) { }

  /**
   * On ngOnInit subscribe to input value changes, change type of payment depending on input value and distpatch filter action
   */
  ngOnInit(): void {

    this.resetFilter$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
        this.maxPriceControl.setValue(0);
        this.minPriceControl.setValue(0);
        this.isFreeControl.reset();
        this.minValue = 0;
        this.maxValue= 0;
    })

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

    this.minPrice$.pipe(
      takeUntil(this.destroy$)
    ).subscribe((value) => {
        this.minPriceControl.setValue(value,{emitEvent: false});
        this.minValue = value;
    })

    this.maxPrice$.pipe(
      takeUntil(this.destroy$)
    ).subscribe((value) => {
        this.maxPriceControl.setValue(value,{emitEvent: false});
        this.maxValue= value;
    })

    this.isFree$.pipe(
      takeUntil(this.destroy$)
    ).subscribe((value) => {
        this.isFreeControl.setValue(value,{emitEvent: false});
    })

  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
