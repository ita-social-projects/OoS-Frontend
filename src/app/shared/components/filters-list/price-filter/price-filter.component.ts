import { Options } from '@angular-slider/ngx-slider';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, } from '@angular/forms';
import { Store } from '@ngxs/store';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, takeUntil } from 'rxjs/operators';
import { Constants } from 'src/app/shared/constants/constants';
import { SetIsFree, SetMaxPrice, SetMinPrice } from 'src/app/shared/store/filter.actions';
@Component({
  selector: 'app-price-filter',
  templateUrl: './price-filter.component.html',
  styleUrls: ['./price-filter.component.scss']
})
export class PriceFilterComponent implements OnInit, OnDestroy {

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

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
