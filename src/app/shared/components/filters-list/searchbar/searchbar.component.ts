import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject, distinctUntilChanged, map, startWith, takeUntil, tap } from 'rxjs';
import { DefaultFilterState } from 'src/app/shared/models/defaultFilterState.model';
import { NavBarName } from '../../../enum/navigation-bar';
import { Navigation } from '../../../models/navigation.model';
import { SetSearchQueryValue } from '../../../store/filter.actions';
import { FilterState } from '../../../store/filter.state';
import { NavigationState } from '../../../store/navigation.state';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss']
})
export class SearchbarComponent implements OnInit, OnDestroy {
  constructor(private store: Store, private router: Router) {}

  searchValueFormControl = new FormControl('', [Validators.maxLength(256)]);
  filteredResults: string[];

  @Select(NavigationState.navigationPaths)
  navigationPaths$: Observable<Navigation[]>;
  @Select(FilterState.searchQuery)
  searchQuery$: Observable<string>;
  destroy$: Subject<boolean> = new Subject<boolean>();

  private previousResults: string[] = this.getPreviousResults();
  private isResultPage = false;
  private searchedText: string;

  ngOnInit(): void {
    // Detects if search bar is displayed on the main page or on the result page
    this.navigationPaths$
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (navigationPaths: Navigation[]) =>
          (this.isResultPage = navigationPaths.some((path: Navigation) => path.name === NavBarName.WorkshopResult))
      );

    this.searchValueFormControl.valueChanges
      .pipe(
        distinctUntilChanged(),
        startWith(''),
        takeUntil(this.destroy$),
        map((value: string) => value.trim()),
        tap((value: string) => this.filter(value))
      )
      .subscribe((value: string) => (this.searchedText = value));

    this.searchQuery$
      .pipe(takeUntil(this.destroy$))
      .subscribe((text: string) => this.searchValueFormControl.setValue(text, { emitEvent: false }));

    // The input value is reset when the user is on main page, but when the user is on the result page,
    // the input value should be remained
    if (!this.isResultPage) {
      this.searchValueFormControl.setValue('', { emitEvent: false });
    }
  }

  onValueEnter(): void {
    this.performSearch();
    this.saveSearchResults();
  }

  onValueSelect(): void {
    this.performSearch();
  }

  private performSearch(): void {
    let filterQueryParams: Partial<DefaultFilterState> = { searchQuery: this.searchValueFormControl.value };
    !this.isResultPage && this.router.navigate(['result/list'], { queryParams: { filter: filterQueryParams }, replaceUrl: true });
    this.store.dispatch(new SetSearchQueryValue(this.searchedText || ''));
  }
  /**
   * This method saves the search input value to teh local storage if the value exists
   * and if it is not included to teh previous results. If teh length of the saved search length is more
   * than the 4, then it is shifted and added the new one to teh array.
   */
  private saveSearchResults(): void {
    this.previousResults = this.getPreviousResults();

    if (this.searchedText && !this.previousResults.includes(this.searchedText)) {
      this.previousResults.length > 4 && this.previousResults.shift();
      this.previousResults.unshift(this.searchedText);
      localStorage.setItem('previousResults', JSON.stringify(this.previousResults));
    }
  }

  /**
   * This method gets the previous entered serach values from the local storage, if there is no value, then it sets an empty array
   */
  private getPreviousResults(): string[] {
    const previousResults: string[] | undefined = JSON.parse(localStorage.getItem('previousResults'));
    if (previousResults?.length) {
      return previousResults;
    } else {
      localStorage.setItem('previousResults', JSON.stringify([]));
      return [];
    }
  }

  private filter(value: string): void {
    this.filteredResults = this.previousResults.filter((result: string) => result.toLowerCase().includes(value.toLowerCase()));
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
