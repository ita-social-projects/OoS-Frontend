import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Direction } from '../../models/category.model';
import { SetDirections } from '../../store/filter.actions';


@Component({
  selector: 'app-category-card',
  templateUrl: './category-card.component.html',
  styleUrls: ['./category-card.component.scss']
})
export class CategoryCardComponent implements OnInit {

  @Input() direction: Direction;
  @Input() icons: {};
  workshopsAmount = Math.floor(Math.random() * 300);

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.getWord();
  }

  selectDirection(direction: Direction): void {
    this.store.dispatch(new SetDirections([direction]));
  }
  /**
   * Returns correct form of the ukrainian word "гурток" depending on the amount of workshops by category.
   * @returns correct form of the word
   *
   */
  getWord(): string {
    if (this.workshopsAmount % 100 >= 10 && this.workshopsAmount % 100 <= 20) {
      return "гуртків";
    } else {
      if (this.workshopsAmount % 10 === 0 || this.workshopsAmount % 10 > 4) {
        return "гуртків";
      } else if (this.workshopsAmount % 10 === 1) {
        return "гурток";
      } else if (this.workshopsAmount % 10 > 1 && this.workshopsAmount % 10 < 5) {
        return "гуртки";
      }
    }
  }
}
