import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Constants } from '../../../../../shared/constants/constants';

@Component({
  selector: 'app-stars',
  templateUrl: './stars.component.html',
  styleUrls: ['./stars.component.scss']
})
export class StarsComponent implements OnInit {
  ratingFormControl = new FormControl('');
  selectedStars = 0;
  ratingStars: number[] = [
    Constants.RATE_ONE_STAR,
    Constants.RATE_TWO_STAR,
    Constants.RATE_THREE_STAR,
    Constants.RATE_FOUR_STAR,
    Constants.RATE_FIVE_STAR
  ];

  @Output() ratingSelect = new EventEmitter();
  @Input() modalWindow = false;
  @Input() rating: number;

  constructor() {}

  ngOnInit(): void {
    this.ratingSelect.emit(this.ratingFormControl);
  }

  onClick(stars: number): void {
    this.selectedStars = stars;
  }
}
