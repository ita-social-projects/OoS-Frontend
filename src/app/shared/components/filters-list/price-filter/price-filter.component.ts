import { Options } from '@angular-slider/ngx-slider';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, } from '@angular/forms';
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
export class PriceFilterComponent implements OnInit {

  readonly constants: typeof Constants = Constants;

  isFree: boolean = false;
  isPaid: boolean = false;
  isFreeControl = new FormControl(false);
  isPaidControl = new FormControl(false);
  maxPriceControl = new FormControl(0, [Validators.maxLength(4)]);
  minPriceControl = new FormControl(0, [Validators.maxLength(4)]);
  sliderControl = new FormControl('');
  minValue: number = 0;
  maxValue: number = 0;
  options: Options = {
    floor: 0,
    ceil: 2000,
  };
  destroy$: Subject<boolean> = new Subject<boolean>();


  constructor(private store: Store) { }

  /**
   * On ngOnInit subscribe to input value changes, change type of payment depending on input value and distpatch filter action
   */
  ngOnInit(): void {
    this.isFreeControl.valueChanges.subscribe((val) => this.store.dispatch(new SetIsFree(val)));
    this.isPaidControl.valueChanges.subscribe((val) => this.store.dispatch(new SetIsPaid(val)));
    this.minPriceControl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        distinctUntilChanged()
      ).subscribe(val => {
        if (val) {
          this.isPaid = true;
          this.store.dispatch(new SetMinPrice(val));
        } else {
          this.isPaid = !!this.maxValue;
        }
      });

    this.maxPriceControl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        distinctUntilChanged()
      ).subscribe(val => {
        if (val) {
          this.isPaid = true;
          this.store.dispatch(new SetMaxPrice(val));
        } else {
          this.isPaid = !!this.minValue;
        }
      });
  }

  /**
  * This method changes status of IsFree type of payment and distpatch filter action
  */
  onIsFreeClick(): void {
    this.isFree = !this.isFree;
  }

  /**
  * This method changes status of isPaid type of payment and distpatch filter action
  */
  onIsPaidClick(): void {
    this.isPaid = !this.isPaid;
  }
}
