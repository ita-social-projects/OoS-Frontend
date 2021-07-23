import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Constants } from 'src/app/shared/constants/constants';

@Component({
  selector: 'app-rating-form-control',
  templateUrl: './rating-form-control.component.html',
  styleUrls: ['./rating-form-control.component.scss'],
})
export class RatingFormControlComponent implements OnInit {

  ratingFormControl = new FormControl('');
  @Output() ratingSelect = new EventEmitter();

  rating: number[] = [
    Constants.RATE_ONE_STAR,
    Constants.RATE_TWO_STAR,
    Constants.RATE_THREE_STAR,
    Constants.RATE_FOUR_STAR,
    Constants.RATE_FIVE_STAR,
  ];

  constructor() { }

  ngOnInit(): void {
    this.ratingSelect.emit(this.ratingFormControl);
  }
}
