import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { distinctUntilChanged, map, Observable, startWith, Subject, takeUntil, tap, withLatestFrom } from 'rxjs';

import { NavBarName } from 'shared/enum/enumUA/navigation-bar';
import { DefaultFilterState } from 'shared/models/default-filter-state.model';
import { Navigation } from 'shared/models/navigation.model';
import { AddWorkshopPreviousResult, RemoveWorkshopPreviousResult, SetWorkshopSearchQueryValue } from 'shared/store/filter.actions';
import { FilterState } from 'shared/store/filter.state';
import { NavigationState } from 'shared/store/navigation.state';
import { SEARCHBAR_REGEX_REPLACE, SEARCHBAR_REGEX_VALID } from 'shared/constants/regex-constants';
import { ValidationConstants } from 'shared/constants/validation';
import { WorkshopType } from 'shared/enum/workshop';

@Component({
  selector: 'app-workshop-searchbar',
  templateUrl: './shared-searchbar.component.html',
  styleUrls: ['./shared-searchbar.component.scss']
})
export class SharedSearchbarComponent implements OnInit, OnDestroy {
  @Input() public for: WorkshopType;
  @Output() public outputSearchFormControl = new EventEmitter<FormControl>();

  @Select(NavigationState.navigationPaths)
  private readonly navigationPaths$: Observable<Navigation[]>;
  @Select(FilterState.entitySearchQuery)
  private readonly searchQuery$: Observable<string>;
  @Select(FilterState.entityPreviousResults)
  private readonly previousResults$: Observable<string[]>;

  public filteredResults: string[];
  public searchValueFormControl = new FormControl('', [
    Validators.maxLength(ValidationConstants.MAX_SEARCH_LENGTH_200),
    Validators.pattern(SEARCHBAR_REGEX_VALID)
  ]);

  private isResultPage = false;
  private searchedText: string;
  private readonly destroy$: Subject<boolean> = new Subject<boolean>();
  private tempSearchValue: string = '';

  constructor(private readonly store: Store) {}

  public ngOnInit(): void {
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
        map((value: string) => value.trim()),
        withLatestFrom(this.previousResults$),
        tap(([value, results]: [string, string[]]) => {
          this.tempSearchValue = value;
          this.filteredResults = results.filter((result: string) => result.toLowerCase().includes(value.toLowerCase()));
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();

    this.searchQuery$
      .pipe(takeUntil(this.destroy$))
      .subscribe((text: string) => this.searchValueFormControl.setValue(text, { emitEvent: false }));

    // The input value is reset when the user is on the main page, but when the user is on the result page,
    // the input value should remain
    if (!this.isResultPage) {
      this.searchValueFormControl.setValue('', { emitEvent: false });
    }
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public onValueEnter(): void {
    this.performSearch();
  }

  public onValueSelect(): void {
    this.performSearch();
  }

  public handleInvalidCharacter(value: string): string {
    const validValue = value?.replace(SEARCHBAR_REGEX_REPLACE, '');
    if (validValue !== value) {
      this.searchValueFormControl.setValue(validValue, { emitEvent: true });
      this.searchValueFormControl.setErrors({ ...this.searchValueFormControl.errors, invalidSearch: true });
    } else {
      const currentErrors = { ...this.searchValueFormControl.errors };
      delete currentErrors.invalidSearch;
      this.searchValueFormControl.setErrors(Object.keys(currentErrors).length ? currentErrors : null);
    }
    this.outputSearchFormControl.emit(this.searchValueFormControl);
    return validValue;
  }

  public onDeletePreviousSearchValue(previousValue: string, event: Event): void {
    event.stopPropagation();
    this.filteredResults = this.filteredResults.filter((result: string) => result !== previousValue);
    this.store.dispatch(new RemoveWorkshopPreviousResult(previousValue));
  }

  private performSearch(): void {
    const searchValue = this.handleInvalidCharacter(this.tempSearchValue);

    if (this.searchValueFormControl.valid && searchValue) {
      this.searchedText = searchValue;
      this.saveSearchResults();
      const filterQueryParams: Partial<DefaultFilterState> = { searchQuery: searchValue };
      this.store.dispatch(new SetWorkshopSearchQueryValue(this.searchedText || ''));

      this.searchValueFormControl.setValue(searchValue, { emitEvent: false });
    } else {
      this.searchValueFormControl.markAllAsTouched();
    }
  }

  /**
   * This method saves the search input value to the local storage if the value exists
   * and if it is not included in the previous results. If the length of the saved search length is more
   * than 10, then the oldest value is removed and the new one is added.
   */
  private saveSearchResults(): void {
    this.store.dispatch(new AddWorkshopPreviousResult(this.searchedText));
  }

  protected readonly WorkshopType = WorkshopType;
}
