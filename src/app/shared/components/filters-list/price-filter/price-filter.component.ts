import { Options } from '@angular-slider/ngx-slider';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { ValidationConstants } from 'shared/constants/validation';
import { SetIsFree, SetIsPaid, SetMaxPrice, SetMinPrice } from 'shared/store/filter.actions';

@Component({
  selector: 'app-price-filter',
  templateUrl: './price-filter.component.html',
  styleUrls: ['./price-filter.component.scss']
})
export class PriceFilterComponent implements OnInit, OnDestroy {
  @Input()
  public set priceFilter(filter) {
    const { minPrice, maxPrice, isFree, isPaid } = filter;
    this.minPriceControl.setValue(minPrice, { emitEvent: false });
    this.minValue = minPrice;
    this.maxPriceControl.setValue(maxPrice, { emitEvent: false });
    this.maxValue = maxPrice;
    this.isFreeControl.setValue(isFree, { emitEvent: false });
    this.isPaidControl.setValue(isPaid, { emitEvent: false });
    this.options.disabled = !isPaid;
  }

  public readonly validationConstants = ValidationConstants;

  public isFreeControl = new FormControl(false);
  public isPaidControl = new FormControl(false);

  public minPriceControl = new FormControl(ValidationConstants.MIN_PRICE, [Validators.maxLength(4)]);
  public maxPriceControl = new FormControl(ValidationConstants.MAX_PRICE, [Validators.maxLength(4)]);

  public minValue = ValidationConstants.MIN_PRICE;
  public maxValue = ValidationConstants.MAX_PRICE;
  public options: Options = this.getSliderOprions(true);
  public destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private store: Store) {}

  /**
   * On ngOnInit subscribe to input value changes, change type of payment depending on input value and distpatch filter action
   */
  public ngOnInit(): void {
    // We shouldn't disable Price controls if we receive in url query string Paid checkbox as True
    if (!this.isPaidControl.value) {
      this.maxPriceControl.disable();
      this.minPriceControl.disable();
    }

    this.isFreeControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((val: boolean) => this.store.dispatch(new SetIsFree(val)));

    this.isPaidControl.valueChanges.pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$)).subscribe((val: boolean) => {
      const func = val ? 'enable' : 'disable';
      if (!val) {
        this.store.dispatch([new SetMinPrice(ValidationConstants.MIN_PRICE), new SetMaxPrice(ValidationConstants.MAX_PRICE)]);
      }
      this.store.dispatch(new SetIsPaid(val));
      this.minPriceControl[func]();
      this.maxPriceControl[func]();
      this.options = this.getSliderOprions(!val);
    });

    this.minPriceControl.valueChanges.pipe(debounceTime(500), distinctUntilChanged(), takeUntil(this.destroy$)).subscribe((val: number) => {
      !this.isPaidControl.value && this.isPaidControl.setValue(true);
      this.store.dispatch(new SetMinPrice(val));
    });

    this.maxPriceControl.valueChanges.pipe(debounceTime(500), distinctUntilChanged(), takeUntil(this.destroy$)).subscribe((val: number) => {
      !this.isPaidControl.value && this.isPaidControl.setValue(true);
      this.store.dispatch(new SetMaxPrice(val));
    });
  }

  public getSliderOprions(val): Options {
    return {
      floor: ValidationConstants.MIN_PRICE,
      ceil: ValidationConstants.MAX_PRICE,
      disabled: val
    };
  }

  public clearMin(): void {
    this.minPriceControl.reset();
  }

  public clearMax(): void {
    this.maxPriceControl.setValue(ValidationConstants.MAX_PRICE);
  }

  public priceHandler(e): void {
    e.pointerType && this.maxPriceControl.setValue(e.highValue);
    !e.pointerType && this.minPriceControl.setValue(e.value);
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
