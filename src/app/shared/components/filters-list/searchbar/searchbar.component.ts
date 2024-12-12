import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject, distinctUntilChanged, map, startWith, takeUntil, tap } from 'rxjs';

import { NavBarName } from 'shared/enum/enumUA/navigation-bar';
import { DefaultFilterState } from 'shared/models/default-filter-state.model';
import { Navigation } from 'shared/models/navigation.model';
import { SetSearchQueryValue } from 'shared/store/filter.actions';
import { FilterState } from 'shared/store/filter.state';
import { NavigationState } from 'shared/store/navigation.state';
import { SEARCHBAR_REGEX_VALID } from 'shared/constants/regex-constants';
import { SEARCHBAR_REGEX_REPLACE } from 'shared/constants/regex-constants';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss']
})
export class SearchbarComponent implements OnInit, OnDestroy {
  @Output() public invalidCharacterDetected = new EventEmitter<void>();
  @Output() public validCharacterDetected = new EventEmitter<void>();

  @Select(NavigationState.navigationPaths)
  private navigationPaths$: Observable<Navigation[]>;
  @Select(FilterState.searchQuery)
  private searchQuery$: Observable<string>;

  public filteredResults: string[];
  public searchValueFormControl = new FormControl('', [Validators.maxLength(64), Validators.pattern(SEARCHBAR_REGEX_VALID)]);

  private previousResults: string[] = this.getPreviousResults();
  private isResultPage = false;
  private searchedText: string;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private store: Store,
    private router: Router
  ) {}

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
        takeUntil(this.destroy$),
        map((value: string) => value.trim()),
        tap((value: string) => this.filter(value))
      )
      .subscribe((value: string) => {
        this.searchedText = value;
        this.handleInvalidCharacter(value);
      });

    this.searchQuery$
      .pipe(takeUntil(this.destroy$))
      .subscribe((text: string) => this.searchValueFormControl.setValue(text, { emitEvent: false }));

    // The input value is reset when the user is on main page, but when the user is on the result page,
    // the input value should be remained
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
    this.saveSearchResults();
  }

  public onValueSelect(): void {
    this.performSearch();
  }

  public handleInvalidCharacter(value: string): void {
    const validValue = value?.replace(SEARCHBAR_REGEX_REPLACE, '');
    if (validValue !== value) {
      this.searchValueFormControl.setValue(validValue);
      this.invalidCharacterDetected.emit();
    } else {
      this.validCharacterDetected.emit();
    }
  }

  public onValueDelete(value: string, event: MouseEvent): void {
    event.stopPropagation();
    this.previousResults = this.previousResults.filter((result: string) => result !== value);
    localStorage.setItem('previousResults', JSON.stringify(this.previousResults));
    this.filteredResults = this.filteredResults.filter((result: string) => result !== value);
  }

  private performSearch(): void {
    const filterQueryParams: Partial<DefaultFilterState> = { searchQuery: this.searchValueFormControl.value };
    if (!this.isResultPage) {
      this.router.navigate(['result/List'], { queryParams: { filter: filterQueryParams }, replaceUrl: false });
    }
    this.store.dispatch(new SetSearchQueryValue(this.searchedText || ''));
  }
  /**
   * This method saves the search input value to the local storage if the value exists
   * and if it is not included to the previous results. If the length of the saved search length is more
   * than the 10, then it is popped out and added the new one to the array.
   */
  private saveSearchResults(): void {
    this.previousResults = this.getPreviousResults();

    if (this.searchedText && !this.previousResults.includes(this.searchedText)) {
      if (this.previousResults.length > 9) {
        this.previousResults.pop();
      }
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
}
