import { Options, ChangeContext } from '@angular-slider/ngx-slider';
import { Component, Input, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormControl, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Store, Select } from '@ngxs/store';
import { Subject, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil, filter } from 'rxjs/operators';
import { ValidationConstants } from 'shared/constants/validation';
import { PriceFilter, MinMaxPriceFilter } from 'shared/models/filter-list.model';
import { SetIsFree, SetIsPaid, SetMaxPrice, SetMinPrice, SetPayRate, FilterChange } from 'shared/store/filter.actions';
import { PayRateType } from 'shared/enum/workshop';
import { PayRateTypeEnum } from 'shared/enum/enumUA/workshop';
import { FilterState } from 'shared/store/filter.state';
import { ValidationMessages, ErrorConditionsInterface } from 'shared/enum/validation-messages';

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
    this.minValue = minPrice;
    this.maxPriceControl.setValue(maxPrice, { emitEvent: false });
    this.maxValue = maxPrice;
    this.isFreeControl.setValue(isFree, { emitEvent: false });
    this.isPaidControl.setValue(isPaid, { emitEvent: false });
    this.options.disabled = !isPaid;
    this.payRateControl.setValue(payRate, { emitEvent: false });
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

    this.limitMinMaxPrice$.pipe(takeUntil(this.destroy$), filter(Boolean)).subscribe((limitMinMaxPrice: MinMaxPriceFilter) => {
      this.limitMinMaxPrice = limitMinMaxPrice;
      this.options = this.getSliderOptions(!this.isPaidControl.value);
      this.updateMinMaxPrice();
      this.minPriceControl.setValidators(validatorMinMaxPrice('min', this.limitMinMaxPrice, this.maxValue));
      this.maxPriceControl.setValidators(validatorMinMaxPrice('max', this.limitMinMaxPrice, this.minValue));
      this.minPriceControl.updateValueAndValidity({ emitEvent: false });
      this.maxPriceControl.updateValueAndValidity({ emitEvent: false });
      this.cdr.markForCheck();
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

    this.minPriceControl.valueChanges.pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$)).subscribe((val: number) => {
      if (!this.isPaidControl.value) {
        this.isPaidControl.setValue(true);
      }
      if (!this.minPriceControl.errors && !this.maxPriceControl.errors) {
        this.store.dispatch(new SetMinPrice(val));
        this.minValue = val;
        this.maxPriceControl.updateValueAndValidity({ emitEvent: false });
      }
    });

    this.maxPriceControl.valueChanges.pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$)).subscribe((val: number) => {
      if (!this.isPaidControl.value) {
        this.isPaidControl.setValue(true);
      }
      if (!this.maxPriceControl.errors && !this.minPriceControl.errors) {
        this.store.dispatch(new SetMaxPrice(val));
        this.maxValue = val;
        this.minPriceControl.updateValueAndValidity({ emitEvent: false });
      }
    });
  }

  public getSliderOptions(disabled: boolean): Options {
    const sliderOptions = this.options
      ? { ...this.options }
      : {
          floor: ValidationConstants.MIN_PRICE,
          ceil: ValidationConstants.MAX_PRICE
        };

    if (this.limitMinMaxPrice?.isActiveLimitation) {
      sliderOptions.floor = this.limitMinMaxPrice.minPrice;
      sliderOptions.ceil = this.limitMinMaxPrice.maxPrice;
    }

    return { ...sliderOptions, disabled: disabled };
  }

  public clearMin(): void {
    const minPrice: number = this.limitMinMaxPrice.isActiveLimitation ? this.limitMinMaxPrice.minPrice : ValidationConstants.MIN_PRICE;
    this.minPriceControl.setValue(minPrice);
  }

  public clearMax(): void {
    const maxPrice: number = this.limitMinMaxPrice.isActiveLimitation ? this.limitMinMaxPrice.maxPrice : ValidationConstants.MAX_PRICE;
    this.maxPriceControl.setValue(maxPrice);
  }

  public clearPayRate(): void {
    this.payRateControl.setValue(PayRateType.None);
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

  private updateMinMaxPrice(): void {
    if (this.minValue < this.options.floor || this.minValue > this.options.ceil) {
      this.minValue = this.options.floor;
      this.minPriceControl.setValue(this.minValue, { emitEvent: false });
    }

    if (this.maxValue > this.options.ceil || this.maxValue < this.options.floor) {
      this.maxValue = this.options.ceil;
      this.maxPriceControl.setValue(this.maxValue, { emitEvent: false });
    }
  }
}

export function validatorMinMaxPrice(minMax: string, limitMinMaxPrice: MinMaxPriceFilter, currentMinMaxPrice: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const errors: ErrorConditionsInterface[] = [];
    if (limitMinMaxPrice?.isActiveLimitation) {
      const value = control.value;
      if (minMax === 'min') {
        if (value < limitMinMaxPrice.minPrice || value > limitMinMaxPrice.maxPrice || value > currentMinMaxPrice) {
          errors.push({ condition: () => true, message: ValidationMessages.INVALID_MINIMUM_FILTER_PRICE });
        }
      } else if (minMax === 'max') {
        if (value > limitMinMaxPrice.maxPrice || value < limitMinMaxPrice.minPrice || value < currentMinMaxPrice) {
          errors.push({ condition: () => true, message: ValidationMessages.INVALID_MAXIMUM_FILTER_PRICE });
        }
      }
    }
    return errors.length > 0 ? { ListErrors: errors } : null;
  };
}
