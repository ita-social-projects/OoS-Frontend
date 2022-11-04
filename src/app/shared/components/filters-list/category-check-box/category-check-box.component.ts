import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, takeUntil } from 'rxjs/operators';
import { Direction } from '../../../models/category.model';
import { AppState } from '../../../store/app.state';
import { SetDirections } from '../../../store/filter.actions';
import { GetDirections } from '../../../store/meta-data.actions';
import { MetaDataState } from '../../../store/meta-data.state';

@Component({
  selector: 'app-category-check-box',
  templateUrl: './category-check-box.component.html',
  styleUrls: ['./category-check-box.component.scss'],
})
export class CategoryCheckBoxComponent implements OnInit, AfterViewInit, OnDestroy {
  @Select(MetaDataState.directions)
  directions$: Observable<Direction[]>;
  @Select(AppState.isMobileScreen)
  isMobileScreen$: Observable<boolean>;

  @ViewChild('listWrapper') filterContainer: ElementRef;

  @Input() slectedDirectionIds: number[];

  destroy$: Subject<boolean> = new Subject<boolean>();
  allDirections: Direction[] = [];
  filteredDirections: Direction[] = [];
  directionSearchFormControl = new FormControl('');

  constructor(private store: Store) {}

  ngAfterViewInit(): void {
    if (this.slectedDirectionIds?.length) {
      this.scrollToSelectedDirection();
    }
  }

  ngOnInit(): void {
    this.store.dispatch(new GetDirections());
    this.directions$
      .pipe(
        filter(direction => !!direction),
        takeUntil(this.destroy$)
      )
      .subscribe(directions => {
        this.allDirections = directions;
        this.filteredDirections = directions;
      });
    this.directionSearchFormControl.valueChanges
      .pipe(takeUntil(this.destroy$), debounceTime(300), distinctUntilChanged())
      .subscribe((val: string) => this.filterDirections(val));
  }

  /**
   * This method add checked direction to the list of selected directions and distpatch filter action
   * @param direction
   * @param event
   */
  onDirectionCheck(direction: Direction, event: MatCheckbox): void {
    event.checked
      ? this.slectedDirectionIds.push(direction.id)
      : this.slectedDirectionIds.splice(
          this.slectedDirectionIds.findIndex((selectedDirection: number) => selectedDirection === direction.id),
          1
        );
    this.store.dispatch(new SetDirections(this.slectedDirectionIds));
  }

  /**
   * This method filter directions according to the input value
   * @param value string
   */
  private filterDirections(value: string): void {
    this.filteredDirections = this.allDirections.filter((direction: Direction) =>
      direction.title.toLowerCase().startsWith(value.toLowerCase())
    );
  }

  /**
   * This method check if value is checked
   * @returns boolean
   */
  onSelectCheck(direction: Direction): boolean {
    return this.slectedDirectionIds.some((directionId: number) => directionId === direction.id);
  }

  private scrollToSelectedDirection(): void {
    setTimeout(() => {
      const itemsList: HTMLCollection = this.filterContainer.nativeElement.children;
      for (let i = 0; i <= itemsList.length; i++) {
        const checkboxElement = itemsList.item(i)?.children[0];

        if (checkboxElement?.classList.contains('mat-checkbox-checked')) {
          this.filterContainer.nativeElement.scrollTop = this.filterContainer.nativeElement.children[i].offsetTop;
        }
      }
    }, 500); //this is needed to wait until loaded direction list will be displayed in the template
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
