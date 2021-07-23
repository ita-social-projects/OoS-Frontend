import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Constants } from 'src/app/shared/constants/constants';
import { StarRate } from 'src/app/shared/models/rating';

@Component({
  selector: 'app-rating-form-control',
  templateUrl: './rating-form-control.component.html',
  styleUrls: ['./rating-form-control.component.scss'],
})
export class RatingFormControlComponent implements OnInit {

  ratingFormControl = new FormControl('');
  @Output() ratingSelect = new EventEmitter();

  rating: StarRate[] = [
    {
      value: Constants.RATE_ONE_STAR,
      selected: false,
    },
    {
      value: Constants.RATE_TWO_STAR,
      selected: false,
    },
    {
      value: Constants.RATE_THREE_STAR,
      selected: false,
    },
    {
      value: Constants.RATE_FOUR_STAR,
      selected: false,
    },
    {
      value: Constants.RATE_FIVE_STAR,
      selected: false,
    }
  ];

  constructor() { }

  ngOnInit(): void {
    this.ratingSelect.emit(this.ratingFormControl);
  }
}
