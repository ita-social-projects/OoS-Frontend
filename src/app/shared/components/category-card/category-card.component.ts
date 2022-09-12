import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { emit } from 'process';
import { CategoryIcons } from '../../../shared/enum/category-icons';
import { Direction } from '../../../shared/models/category.model';
import { SetDirections } from '../../../shared/store/filter.actions';
import { WorkshopDeclination } from '../../enum/enumUA/declinations/declination';

@Component({
  selector: 'app-category-card',
  templateUrl: './category-card.component.html',
  styleUrls: ['./category-card.component.scss']
})
export class CategoryCardComponent {
  @Input() workshopsCount: number;
  @Input() isEditMode: boolean;
  @Input() direction: Direction;
  @Input() icons: {};
  @Output() deleteDirection = new EventEmitter<Direction>();

  readonly WorkshopDeclination = WorkshopDeclination;
  
  public categoryIcons = CategoryIcons;

  constructor(
    private store: Store, 
    private router: Router
  ) {}

  onDelete(event: Event): void {
    this.deleteDirection.emit(this.direction);
    event.stopPropagation();
  }

  selectDirection(direction: Direction): void {
    this.store.dispatch(new SetDirections([direction]));
    this.router.navigate(['/result']);
  }
}
