import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { CategoryIcons } from '../../enum/category-icons';
import { Direction } from '../../models/category.model';
import { SetDirections } from '../../store/filter.actions';

@Component({
  selector: 'app-category-card',
  templateUrl: './category-card.component.html',
  styleUrls: ['./category-card.component.scss']
})
export class CategoryCardComponent implements OnInit {
  @Input() workshopsCount: number;
  @Input() direction: Direction;
  @Input() icons: {};
  public categoryIcons = CategoryIcons;

  constructor(private store: Store) {
  }

  ngOnInit(): void {
  }

  selectDirection(direction: Direction): void {
    this.store.dispatch(new SetDirections([direction]));
  }
  /**
   * Returns correct form of the ukrainian word "гурток" depending on the amount of workshops by category.
   * @returns correct form of the word
   *
   */
  getWord(workshopsAmount): string {
    if ((workshopsAmount % 100 >= 10 && workshopsAmount % 100 <= 20) || (workshopsAmount % 10 === 0 || workshopsAmount % 10 > 4)) {
      return 'гуртків';
    } else {
      if (workshopsAmount % 10 === 1) {
        return 'гурток';
      } else if (workshopsAmount % 10 > 1 && workshopsAmount % 10 < 5) {
        return 'гуртки';
      }
    }
  }

}
