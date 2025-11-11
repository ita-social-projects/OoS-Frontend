import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { ValidationConstants } from 'shared/constants/validation';

@Component({
  template: ''
})
export abstract class SearchComponent implements OnInit, OnDestroy {
  @Output() public outputSearchFormControl = new EventEmitter<FormControl>();
  public filteredResults: string[];
  public searchValueFormControl = new FormControl('', [Validators.maxLength(ValidationConstants.MAX_SEARCH_LENGTH_250)]);
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

  protected abstract performSearch(): void;

  protected abstract saveSearchResults(): void;
}
