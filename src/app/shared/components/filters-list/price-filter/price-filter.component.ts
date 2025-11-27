import { ChangeContext, Options } from '@angular-slider/ngx-slider';
import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, takeUntil } from 'rxjs/operators';
import { ValidationConstants } from 'shared/constants/validation';
import { MinMaxPriceFilter, PriceFilter } from 'shared/models/filter-list.model';
import { SetIsFree, SetIsPaid, SetMaxPrice, SetMinPrice, SetPayRate } from 'shared/store/filter.actions';
import { PayRateType } from 'shared/enum/workshop';
import { PayRateTypeEnum } from 'shared/enum/enumUA/workshop';
import { FilterState } from 'shared/store/filter.state';
import { Util } from 'shared/utils/utils';

@Component({
  selector: 'app-price-filter',
  templateUrl: './price-filter.component.html',
  styleUrls: ['./price-filter.component.scss']
})
export class PriceFilterComponent implements OnInit, OnDestroy {
  @Select(FilterState.limitMinMaxPrice)
  public limitMinMaxPrice$: Observable<MinMaxPriceFilter>;

  public readonly validationConstants = ValidationConstants;
  public readonly PayRateType = PayRateType;
  public readonly PayRateTypeEnum = PayRateTypeEnum;

  public isFreeControl = new FormControl(false);
  public isPaidControl = new FormControl(false);
  public limitMinMaxPrice: MinMaxPriceFilter = { minPrice: 0, maxPrice: 0, isActiveLimitation: false };

  public minPriceControl = new FormControl(ValidationConstants.MIN_PRICE);
  public maxPriceControl = new FormControl(ValidationConstants.MAX_PRICE);
  public payRateControl: FormControl = new FormControl(PayRateType.None);

  public minValue = ValidationConstants.MIN_PRICE;
  public maxValue = ValidationConstants.MAX_PRICE;
  public options: Options = this.getSliderOptions(true);
  public destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private readonly store: Store,
    private readonly cdr: ChangeDetectorRef
  ) {}

  @Input()
  public set priceFilter(priceFilter: PriceFilter) {
    const { minPrice, maxPrice, isFree, isPaid, payRate } = priceFilter;
    this.minPriceControl.setValue(minPrice, { emitEvent: false });
    this.maxPriceControl.setValue(maxPrice, { emitEvent: false });
    this.isFreeControl.setValue(isFree, { emitEvent: false });
    this.isPaidControl.setValue(isPaid, { emitEvent: false });
    this.payRateControl.setValue(payRate, { emitEvent: false });
    this.options.disabled = !isPaid;
  }

  /**
   * On ngOnInit subscribe to input value changes, change type of payment depending on input value and distpatch filter action
   */
  public ngOnInit(): void {
    // We shouldn't disable Price controls if we receive in url query string Paid checkbox as True
    if (!this.isPaidControl.value) {
      this.maxPriceControl.disable();
      this.minPriceControl.disable();
      this.payRateControl.disable();
    }

    this.limitMinMaxPrice$.pipe(takeUntil(this.destroy$)).subscribe((limitMinMaxPrice: MinMaxPriceFilter) => {
      if (limitMinMaxPrice && !Util.deepEqual(this.limitMinMaxPrice, limitMinMaxPrice)) {
        this.limitMinMaxPrice = limitMinMaxPrice;
        const minPrice = this.limitMinMaxPrice.minPrice === 0 ? 1 : this.limitMinMaxPrice.minPrice;
        const maxPrice = this.limitMinMaxPrice.maxPrice;
        this.updatePriceControls(minPrice, maxPrice, !this.isPaidControl.value);
      } else if (!limitMinMaxPrice) {
        this.limitMinMaxPrice = null;
        this.updatePriceControls(this.validationConstants.MIN_PRICE, this.validationConstants.MAX_PRICE, true);
      }
    });

    this.isFreeControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((val: boolean) => this.store.dispatch(new SetIsFree(val)));

    this.isPaidControl.valueChanges.pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$)).subscribe((val: boolean) => {
      const func = val ? 'enable' : 'disable';
      if (!val) {
        this.store.dispatch([new SetMinPrice(this.minValue), new SetMaxPrice(this.maxValue)]);
        this.payRateControl.setValue(PayRateType.None, { emitEvent: false });
      }
      this.store.dispatch(new SetIsPaid(val));
      this.minPriceControl[func]({ emitEvent: false });
      this.maxPriceControl[func]({ emitEvent: false });
      this.payRateControl[func]({ emitEvent: false });
      this.options = this.getSliderOptions(!val);
    });

    this.payRateControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((val: PayRateType) => {
        this.store.dispatch(new SetPayRate(val));
      });

    this.minPriceControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), filter(Boolean), takeUntil(this.destroy$))
      .subscribe((val: number) => {
        if (this.minPriceControl.valid) {
          this.store.dispatch(new SetMinPrice(val));
          this.maxPriceControl.updateValueAndValidity({ emitEvent: false });
        }
        this.minPriceControl.markAsUntouched();
      });

    this.maxPriceControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), filter(Boolean), takeUntil(this.destroy$))
      .subscribe((val: number) => {
        if (this.maxPriceControl.valid) {
          this.store.dispatch(new SetMaxPrice(val));
          this.minPriceControl.updateValueAndValidity({ emitEvent: false });
        }
        this.maxPriceControl.markAsUntouched();
      });
  }

  public onPriceBlur(type: 'min' | 'max'): void {
    if (type === 'min' && !this.minPriceControl.value) {
      const effectiveMin =
        !this.limitMinMaxPrice?.minPrice || this.limitMinMaxPrice.minPrice === 0
          ? this.validationConstants.MIN_PRICE
          : this.limitMinMaxPrice.minPrice;
      this.minPriceControl.setValue(effectiveMin);
    } else if (type === 'max' && !this.maxPriceControl.value) {
      this.maxPriceControl.setValue(this.limitMinMaxPrice?.maxPrice || this.validationConstants.MAX_PRICE);
    }
    this.minPriceControl.markAsUntouched();
    this.maxPriceControl.markAsUntouched();
  }

  public getSliderOptions(disabled: boolean): Options {
    const options: Options = {
      floor: ValidationConstants.MIN_PRICE,
      ceil: ValidationConstants.MAX_PRICE,
      ...this.options,
      disabled: disabled
    };

    if (this.limitMinMaxPrice) {
      options.floor = this.limitMinMaxPrice?.minPrice === 0 ? 1 : this.limitMinMaxPrice?.minPrice;
      options.ceil = this.limitMinMaxPrice?.maxPrice;
    }

    return { ...options };
  }

  public clearMin(): void {
    const minPrice: number = this.limitMinMaxPrice?.minPrice
      ? this.limitMinMaxPrice.minPrice === 0
        ? 1
        : this.limitMinMaxPrice.minPrice
      : ValidationConstants.MIN_PRICE;
    this.minPriceControl.setValue(minPrice);
  }

  public clearMax(): void {
    const maxPrice: number = this.limitMinMaxPrice?.maxPrice ? this.limitMinMaxPrice.maxPrice : ValidationConstants.MAX_PRICE;
    this.maxPriceControl.setValue(maxPrice);
  }

  public priceHandler(e: ChangeContext): void {
    if (e.pointerType) {
      this.maxPriceControl.setValue(e.highValue);
    } else {
      this.minPriceControl.setValue(e.value);
    }
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  private updatePriceControls(minPrice: number, maxPrice: number, sliderDisabled: boolean): void {
    this.minPriceControl.setValue(minPrice, { emitEvent: false });
    this.maxPriceControl.setValue(maxPrice, { emitEvent: false });

    this.minPriceControl.setValidators([Validators.min(minPrice), Validators.max(maxPrice)]);
    this.maxPriceControl.setValidators([Validators.min(minPrice), Validators.max(maxPrice)]);

    this.options = this.getSliderOptions(sliderDisabled);

    this.cdr.markForCheck();
  }
}
