import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';

import { CategoryIcons } from 'shared/enum/category-icons';
import { WorkshopDeclination } from 'shared/enum/enumUA/declinations/declination';
import { Direction } from 'shared/models/category.model';
import { DefaultFilterState } from 'shared/models/default-filter-state.model';
import { SetDirections } from 'shared/store/filter.actions';

@Component({
  selector: 'app-category-card',
  templateUrl: './category-card.component.html',
  styleUrls: ['./category-card.component.scss']
})
export class CategoryCardComponent {
  @Input() public workshopsCount: number;
  @Input() public isEditMode: boolean;
  @Input() public direction: Direction;
  @Input() public icons: {};
  @Output() public deleteDirection = new EventEmitter<Direction>();

  public readonly WorkshopDeclination = WorkshopDeclination;

  public categoryIcons = CategoryIcons;

  constructor(private store: Store, private router: Router) {}

  public onDelete(event: Event): void {
    this.deleteDirection.emit(this.direction);
    event.stopPropagation();
  }

  public selectDirection(direction: Direction): void {
    this.store.dispatch(new SetDirections([direction.id]));
    const filterQueryParams: Partial<DefaultFilterState> = { directionIds: [direction.id] };
    this.router.navigate(['result/list'], { queryParams: { filter: filterQueryParams }, replaceUrl: true });
  }
}
