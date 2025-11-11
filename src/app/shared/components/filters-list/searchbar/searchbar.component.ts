import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { distinctUntilChanged, Observable, startWith, takeUntil, tap, withLatestFrom } from 'rxjs';

import { NavBarName } from 'shared/enum/enumUA/navigation-bar';
import { Navigation } from 'shared/models/navigation.model';
import { AddPreviousResult, RemovePreviousResult, SetSearchQueryValue } from 'shared/store/filter.actions';
import { FilterState } from 'shared/store/filter.state';
import { NavigationState } from 'shared/store/navigation.state';
import { SearchComponent } from 'shared/components/filters-list/search.component';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss']
})
export class SearchbarComponent extends SearchComponent implements OnInit, OnDestroy {
  @Select(FilterState.searchQuery)
  protected readonly searchQuery$: Observable<string>;
  @Select(NavigationState.navigationPaths)
  private readonly navigationPaths$: Observable<Navigation[]>;
  @Select(FilterState.previousResults)
  private readonly previousResults$: Observable<string[]>;
  private isResultPage: boolean = false;

  constructor(
    protected readonly store: Store,
    private readonly router: Router
  ) {
    super(store);
  }

  public ngOnInit(): void {
    this.navigationPaths$
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (navigationPaths: Navigation[]) =>
          (this.isResultPage = navigationPaths.some((path: Navigation) => path.name === NavBarName.WorkshopResult))
      );

    this.searchQuery$.pipe(takeUntil(this.destroy$)).subscribe((searchQuery: string) => {
      this.searchValueFormControl.setValue(searchQuery, { emitEvent: false });
      this.searchedText = searchQuery;
    });

    this.searchValueFormControl.valueChanges
      .pipe(
        distinctUntilChanged(),
        startWith(''),
        withLatestFrom(this.previousResults$),
        tap(([value, results]: [string, string[]]) => {
          this.outputSearchFormControl.emit(this.searchValueFormControl);
          this.filteredResults = results.filter((result: string) => result.toLowerCase().includes(value.toLowerCase()));
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(([value, _]: [string, string[]]) => {
        this.searchedText = value;
      });

    super.ngOnInit();
  }

  public onDeletePreviousSearchValue(previousValue: string, event: Event): void {
    event.stopPropagation();
    this.filteredResults = this.filteredResults.filter((result: string) => result !== previousValue);
    this.store.dispatch(new RemovePreviousResult(previousValue));
  }

  protected performSearch(): void {
    if (this.searchValueFormControl.valid) {
      this.saveSearchResults();
      this.store.dispatch(new SetSearchQueryValue(this.searchedText || ''));
      if (!this.isResultPage) {
        this.router.navigate(['result/List'], { replaceUrl: false });
        return;
      }
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
    this.store.dispatch(new AddPreviousResult(this.searchedText));
  }
}
