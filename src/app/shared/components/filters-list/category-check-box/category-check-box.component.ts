import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, takeUntil } from 'rxjs/operators';

import { Direction } from 'shared/models/category.model';
import { AppState } from 'shared/store/app.state';
import { SetDirections } from 'shared/store/filter.actions';
import { GetDirections } from 'shared/store/meta-data.actions';
import { MetaDataState } from 'shared/store/meta-data.state';

@Component({
  selector: 'app-category-check-box',
  templateUrl: './category-check-box.component.html',
  styleUrls: ['./category-check-box.component.scss']
})
export class CategoryCheckBoxComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input()
  public selectedDirectionIds: number[];

  @Select(AppState.isMobileScreen)
  public isMobileScreen$: Observable<boolean>;
  @Select(MetaDataState.directions)
  private directions$: Observable<Direction[]>;

  @ViewChild('listWrapper')
  private filterContainer: ElementRef;

  public filteredDirections: Direction[] = [];
  public directionSearchFormControl = new FormControl('');
  private allDirections: Direction[] = [];
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private store: Store) {}

  public ngOnInit(): void {
    this.store.dispatch(new GetDirections());
    this.directions$.pipe(filter(Boolean), takeUntil(this.destroy$)).subscribe((directions) => {
      this.allDirections = directions;
      this.filteredDirections = directions;
    });
    this.directionSearchFormControl.valueChanges
      .pipe(takeUntil(this.destroy$), debounceTime(300), distinctUntilChanged())
      .subscribe((value: string) => this.filterDirections(value));
  }

  public ngAfterViewInit(): void {
    if (this.selectedDirectionIds?.length) {
      this.scrollToSelectedDirection();
    }
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  /**
   * This method add checked direction to the list of selected directions and dispatch filter action
   * @param direction
   * @param event
   */
  public onDirectionCheck(direction: Direction, event: MatCheckboxChange): void {
    if (event.checked) {
      this.selectedDirectionIds.push(direction.id);
    } else {
      this.selectedDirectionIds.splice(
        this.selectedDirectionIds.findIndex((selectedDirection: number) => selectedDirection === direction.id),
        1
      );
    }
    this.store.dispatch(new SetDirections(this.selectedDirectionIds));
  }

  /**
   * This method check if value is checked
   * @returns boolean
   */
  public onSelectCheck(direction: Direction): boolean {
    return this.selectedDirectionIds.some((directionId: number) => directionId === direction.id);
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

  private scrollToSelectedDirection(): void {
    setTimeout(() => {
      const itemsList: HTMLCollection = this.filterContainer.nativeElement.children;
      for (let i = 0; i <= itemsList.length; i++) {
        const checkboxElement = itemsList.item(i)?.children[0];

        if (checkboxElement?.classList.contains('mat-checkbox-checked')) {
          this.filterContainer.nativeElement.scrollTop = this.filterContainer.nativeElement.children[i].offsetTop;
        }
      }
    }, 500); // this is needed to wait until loaded direction list will be displayed in the template
  }
}
