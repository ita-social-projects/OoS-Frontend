import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Constants } from 'shared/constants/constants';

@Component({
  selector: 'app-stars',
  templateUrl: './stars.component.html',
  styleUrls: ['./stars.component.scss']
})
export class StarsComponent implements OnInit {
  @Output() public ratingSelect = new EventEmitter();
  @Input() public modalWindow = false;
  @Input() public rating: number;

  public ratingFormControl = new FormControl('');
  public selectedStars = 0;
  public ratingStars: number[] = [
    Constants.RATE_ONE_STAR,
    Constants.RATE_TWO_STAR,
    Constants.RATE_THREE_STAR,
    Constants.RATE_FOUR_STAR,
    Constants.RATE_FIVE_STAR
  ];

  constructor() {}

  public ngOnInit(): void {
    this.ratingSelect.emit(this.ratingFormControl);
  }

  public onClick(stars: number): void {
    this.selectedStars = stars;
  }
}
