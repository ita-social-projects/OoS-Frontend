import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { distinctUntilChanged, map, Observable, startWith, takeUntil, tap, withLatestFrom } from 'rxjs';
import {
  AddEntityPreviousResult,
  ClearEntitySearchQueryValue,
  RemoveEntityPreviousResult,
  SetEntitySearchQueryValue
} from 'shared/store/filter.actions';
import { FilterState } from 'shared/store/filter.state';
import { WorkshopType } from 'shared/enum/workshop';
import { SearchComponent } from 'shared/components/filters-list/search.component';
import { skip } from 'rxjs/operators';

@Component({
  selector: 'app-shared-searchbar',
  templateUrl: './shared-searchbar.component.html',
  styleUrls: ['./shared-searchbar.component.scss']
})
export class SharedSearchbarComponent extends SearchComponent implements OnInit, OnDestroy {
  @Input() public for: WorkshopType;

  @Select(FilterState.entitySearchQuery)
  protected readonly searchQuery$: Observable<string>;
  @Select(FilterState.entityPreviousResults)
  private readonly previousResults$: Observable<string[]>;
  public readonly WorkshopType = WorkshopType;
  private searchText: string;

  constructor(protected readonly store: Store) {
    super(store);
  }

  public ngOnInit(): void {
    this.searchValueFormControl.valueChanges
      .pipe(
        distinctUntilChanged(),
        startWith(''),
        map((value: string) => value.trim()),
        withLatestFrom(this.previousResults$),
        tap(([value, results]: [string, string[]]) => {
          this.filteredResults = results.filter((result: string) => result.toLowerCase().includes(value.toLowerCase()));
        }),
        takeUntil(this.destroy$),
        skip(1)
      )
      .subscribe((val) => {
        // avoid multiple calls if search was not previously applied
        if (!val[0] && val[0] !== this.searchText) {
          this.performSearch();
        }
      });

    super.ngOnInit();
  }

  public ngOnDestroy(): void {
    this.store.dispatch(new ClearEntitySearchQueryValue());
    super.ngOnDestroy();
  }

  public onDeletePreviousSearchValue(previousValue: string, event: Event): void {
    event.stopPropagation();
    this.filteredResults = this.filteredResults.filter((result: string) => result !== previousValue);
    this.store.dispatch(new RemoveEntityPreviousResult(previousValue));
  }

  protected performSearch(): void {
    if (this.searchValueFormControl.valid) {
      this.searchText = this.searchValueFormControl.value;
      this.saveSearchResults();
      this.store.dispatch(new SetEntitySearchQueryValue(this.searchText || ''));
      this.outputSearchFormControl.emit(this.searchValueFormControl);
    } else {
      this.searchValueFormControl.markAllAsTouched();
    }
  }

  /**
   * This method saves the search input value to the local storage if the value exists
   * and if it is not included in the previous results. If the length of the saved search length is more
   * than 10, then the oldest value is removed and the new one is added.
   */
  protected saveSearchResults(): void {
    this.store.dispatch(new AddEntityPreviousResult(this.searchedText));
  }
}
