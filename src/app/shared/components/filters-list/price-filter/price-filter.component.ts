import { ValidationConstants } from 'src/app/shared/constants/validation';
import { Options } from '@angular-slider/ngx-slider';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators, } from '@angular/forms';
import { Store } from '@ngxs/store';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Constants } from 'src/app/shared/constants/constants';
import { SetIsFree, SetIsPaid, SetMaxPrice, SetMinPrice } from 'src/app/shared/store/filter.actions';

@Component({
  selector: 'app-price-filter',
  templateUrl: './price-filter.component.html',
  styleUrls: ['./price-filter.component.scss']
})
export class PriceFilterComponent implements OnInit, OnDestroy {

  @Input() set priceFilter(filter) {
    const { minPrice, maxPrice, isFree, isPaid } = filter;
    this.minPriceControl.setValue(minPrice, { emitEvent: false });
    this.minValue = minPrice;
    this.maxPriceControl.setValue(maxPrice, { emitEvent: false });
    this.maxValue = maxPrice;
    this.isFreeControl.setValue(isFree, { emitEvent: false });
    this.isPaidControl.setValue(isPaid, { emitEvent: false });
  };

  readonly validationConstants = ValidationConstants;

  isFreeControl = new FormControl(false);
  isPaidControl = new FormControl(false);

  minPriceControl = new FormControl(ValidationConstants.MIN_PRICE, [Validators.maxLength(ValidationConstants.MAX_PRICE_LENGTH)]);
  maxPriceControl = new FormControl(ValidationConstants.MAX_PRICE, [Validators.maxLength(ValidationConstants.MAX_PRICE_LENGTH)]);

  minValue = ValidationConstants.MIN_PRICE;
  maxValue = ValidationConstants.MAX_PRICE;
  options: Options = this.getSliderOprions(true);
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private store: Store) { }

  /**
   * On ngOnInit subscribe to input value changes, change type of payment depending on input value and distpatch filter action
   */
  ngOnInit(): void {
    this.maxPriceControl.disable();
    this.minPriceControl.disable();

    this.isFreeControl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        distinctUntilChanged(),
      ).subscribe((val: boolean) => this.store.dispatch(new SetIsFree(val)));

    this.isPaidControl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        distinctUntilChanged(),
      ).subscribe((val: boolean) => {
        this.store.dispatch(new SetIsPaid(val));
        const func = val ? 'enable' : 'disable';
        this.minPriceControl[func]();
        this.maxPriceControl[func]();
        this.options = this.getSliderOprions(!val)
      });

    this.minPriceControl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(500),
        distinctUntilChanged(),
      ).subscribe((val: number) => {
        !this.isPaidControl.value && this.isPaidControl.setValue(true);
        this.store.dispatch(new SetMinPrice(val));
      });

    this.maxPriceControl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(500),
        distinctUntilChanged()
      ).subscribe((val: number) => {
        !this.isPaidControl.value && this.isPaidControl.setValue(true);
        this.store.dispatch(new SetMaxPrice(val));
      });
  }

  getSliderOprions(val): Options {
    return {
      floor: ValidationConstants.MIN_PRICE,
      ceil: ValidationConstants.MAX_PRICE,
      disabled: val
    }
  }

  priceHandler(e) {
    e.pointerType && this.maxPriceControl.setValue(e.highValue);
    !e.pointerType && this.minPriceControl.setValue(e.value);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
