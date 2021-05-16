import { Options } from '@angular-slider/ngx-slider';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, } from '@angular/forms';
import { Store } from '@ngxs/store';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { SetIsFree, SetIsPaid, SetMaxPrice, SetMinPrice } from 'src/app/shared/store/filter.actions';
@Component({
  selector: 'app-price-filter',
  templateUrl: './price-filter.component.html',
  styleUrls: ['./price-filter.component.scss']
})
export class PriceFilterComponent implements OnInit {

  isFree: boolean = false;
  isPaid: boolean = false;
  maxPrice = new FormControl(0, [Validators.maxLength(4), Validators.minLength(4)]);
  minPrice = new FormControl(0, [Validators.maxLength(4), Validators.minLength(4)]);
  sliderControl = new FormControl('');
  minValue: number = 0;
  maxValue: number = 0;
  options: Options = {
    floor: 0,
    ceil: 2000,
  };
  destroy$: Subject<boolean> = new Subject<boolean>();

  /**
   * Constructor subscribe to input value changes, change type of payment depending on input value and distpatch filter action
   */
  constructor(private store: Store) {
    this.minPrice.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        distinctUntilChanged()
      ).subscribe(val => {
        if (val) {
          this.isPaid = true;
          this.minValue = val;
          this.store.dispatch(new SetMinPrice(this.maxValue));
        } else {
          (!this.maxValue) ? this.isPaid = false : this.isPaid = true;
        }
      });

    this.maxPrice.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        distinctUntilChanged()
      ).subscribe(val => {
        if (val) {
          this.isPaid = true;
          this.maxValue = val;
          this.store.dispatch(new SetMaxPrice(this.maxValue));
        } else {
          (!this.minValue) ? this.isPaid = false : this.isPaid = true;
        }
      });
  }
  ngOnInit(): void { }

  /**
  * This method changes status of IsFree type of payment and distpatch filter action
  */
  onIsFreeClick(): void {
    this.isFree = !this.isFree;
    this.store.dispatch(new SetIsFree(this.isFree));
  }

  /**
  * This method changes status of isPaid type of payment and distpatch filter action
  */
  onIsPaidClick(): void {
    this.isPaid = !this.isPaid;
    this.store.dispatch(new SetIsPaid(this.isPaid));
  }
}
