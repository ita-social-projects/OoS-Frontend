
import { Options } from '@angular-slider/ngx-slider';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, } from '@angular/forms';
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

  constructor(private fb: FormBuilder) {
    this.minPrice.valueChanges.subscribe(val => {
      if (val) {
        this.isPaid = true;
        this.minValue = val;
      } else {
        (!this.maxValue) ? this.isPaid = false : this.isPaid = true;
      }
    });

    this.maxPrice.valueChanges.subscribe(val => {
      if (val) {
        this.isPaid = true;
        this.maxValue = val;
      } else {
        (!this.minValue) ? this.isPaid = false : this.isPaid = true;
      }
    });
  }
  ngOnInit(): void { }

  onIsFreeClick(): void {
    this.isFree = !this.isFree;
  }

  onIsPaidClick(): void {
    this.isPaid = !this.isPaid;
  }
}
