import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Direction } from '../../../models/category.model';
import { AppState } from '../../../store/app.state';
import { SetDirections } from '../../../store/filter.actions';
import { FilterState } from '../../../store/filter.state';
import { GetDirections } from '../../../store/meta-data.actions';
import { MetaDataState } from '../../../store/meta-data.state';


@Component({
  selector: 'app-category-check-box',
  templateUrl: './category-check-box.component.html',
  styleUrls: ['./category-check-box.component.scss'],
})
export class CategoryCheckBoxComponent implements OnInit, OnDestroy {
  @Select(MetaDataState.directions)
  directions$: Observable<Direction[]>;
  @Select(AppState.isMobileScreen)
  isMobileScreen$: Observable<boolean>;
  @Select(FilterState.directions)
  filterDirections$: Observable<Direction[]>;

  @Input() stateDirections: Direction[];
  @Input()
  set categoryCheckBox(filter: Direction[]) {
    this.selectedDirections = filter;
  }

  destroy$: Subject<boolean> = new Subject<boolean>();
  allDirections: Direction[] = [];
  selectedDirections: Direction[] = [];
  filteredDirections: Direction[] = [];
  directionSearch = new FormControl('');
  showAll = true;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(new GetDirections());

    this.directions$.pipe(takeUntil(this.destroy$)).subscribe(directions => (this.allDirections = directions));

    this.directionSearch.valueChanges
      .pipe(takeUntil(this.destroy$), debounceTime(300), distinctUntilChanged())
      .subscribe(val => {
        if (val) {
          this.onDirectionFilter(val);
          this.showAll = false;
        } else {
          this.filteredDirections = [];
          this.showAll = true;
        }
      });

    if (this.stateDirections) {
      this.selectedDirections = this.stateDirections;
    }
  }

  /**
   * This method add checked direction to the list of selected directions and distpatch filter action
   * @param direction
   * @param event
   */
  onDirectionCheck(direction: Direction, event: MatCheckbox): void {
    event.checked
      ? this.selectedDirections.push(direction)
      : this.selectedDirections.splice(
          this.selectedDirections.findIndex((selectedDirection: Direction) => selectedDirection.id === direction.id),
          1
        );
    this.store.dispatch(new SetDirections(this.selectedDirections));
  }

  /**
   * This method filter directions according to the input value
   * @param value string
   */
  onDirectionFilter(value: string): void {
    this.filteredDirections = this.allDirections
      .filter(direction => direction.title.toLowerCase().startsWith(value.toLowerCase()))
      .map(direction => direction);
  }

  /**
   * This method check if value is checked
   * @returns boolean
   */
  onSelectCheck(value: Direction): boolean {
    const result = this.selectedDirections.some(direction => direction.title.startsWith(value.title));
    return result;
  }

  onSearch(): void {
    this.showAll = true;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
