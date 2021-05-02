import { LabelType, Options } from '@angular-slider/ngx-slider';
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
  maxPrice = new FormControl('', [Validators.maxLength(4), Validators.minLength(4)]);
  minPrice = new FormControl('', [Validators.maxLength(4), Validators.minLength(4)]);
  sliderControl = new FormControl('');

  price = 0;

  constructor(private fb: FormBuilder) {
    this.minPrice.valueChanges.subscribe(val => val ? this.isPaid = true : this.isPaid = false);
    this.maxPrice.valueChanges.subscribe(val => val ? this.isPaid = true : this.isPaid = false);
  }
  ngOnInit(): void {

  }

  onIsFreeClick(): void {
    this.isFree = !this.isFree;
  }
  onIsPaidClick(): void {
    this.isPaid = !this.isPaid;
  }
}
