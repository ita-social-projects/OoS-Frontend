import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { ValidationConstants } from 'shared/constants/validation';
import { SEARCHBAR_REGEX_REPLACE, SEARCHBAR_REGEX_VALID } from 'shared/constants/regex-constants';

@Component({
  template: ''
})
export abstract class SearchComponent implements OnInit, OnDestroy {
  @Output() public outputSearchFormControl = new EventEmitter<FormControl>();
  public filteredResults: string[];
  public searchValueFormControl = new FormControl('', [
    Validators.maxLength(ValidationConstants.MAX_SEARCH_LENGTH_200),
    Validators.pattern(SEARCHBAR_REGEX_VALID)
  ]);
  protected searchedText: string;
  protected readonly destroy$: Subject<boolean> = new Subject<boolean>();
  protected abstract searchQuery$: Observable<string>;

  protected constructor(protected readonly store: Store) {}

  public ngOnInit(): void {
    this.searchQuery$
      .pipe(takeUntil(this.destroy$))
      .subscribe((text: string) => this.searchValueFormControl.setValue(text, { emitEvent: false }));
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
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

  protected abstract performSearch(): void;

  protected abstract saveSearchResults(): void;
}
