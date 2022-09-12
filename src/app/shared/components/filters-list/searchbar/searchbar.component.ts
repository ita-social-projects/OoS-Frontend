import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, startWith, takeUntil, tap } from 'rxjs/operators';
import { NavBarName } from 'src/app/shared/enum/navigation-bar';
import { Navigation } from 'src/app/shared/models/navigation.model';
import { GetFilteredWorkshops, SetSearchQueryValue } from 'src/app/shared/store/filter.actions';
import { FilterState } from 'src/app/shared/store/filter.state';
import { NavigationState } from 'src/app/shared/store/navigation.state';
@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss']
})
export class SearchbarComponent implements OnInit, OnDestroy {

  constructor(
    private store: Store,
    private router: Router,
  ) { }

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
    this.navigationPaths$
      .pipe(takeUntil(this.destroy$))
      .subscribe((navigationPaths: Navigation[]) =>
        this.isResultPage = navigationPaths.some((path: Navigation) => path.name === NavBarName.WorkshopResult)
      );

    this.searchValueFormControl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged(),
        startWith(''),
        map((value: string)=> value.trim()),
        tap((value: string)=> this.filter(value))
      ).subscribe((value: string) => this.searchedText = value);

    this.searchQuery$
      .pipe(takeUntil(this.destroy$))
      .subscribe((text: string) => this.searchValueFormControl.setValue(text, { emitEvent: false }));
      
    if(!this.isResultPage) 
      this.searchValueFormControl.setValue('', { emitEvent: false });
  }

  onValueEnter(): void {
    this.performSearch();
    this.saveSearchResults();
  }

  onValueSelect(): void {
    this.performSearch();
  }

  private performSearch(): void {
    !this.isResultPage && this.router.navigate(['/result']);
    this.store.dispatch(new SetSearchQueryValue(this.searchedText || ''));
  }

  private saveSearchResults(): void {
    this.previousResults = this.getPreviousResults();

    this.previousResults.length  > 4 && this.previousResults.shift();
    this.previousResults.unshift(this.searchedText.trim());
  
    localStorage.setItem('previousResults', JSON.stringify(this.previousResults));
  }

  private getPreviousResults(): string[] {
    const previousResults: string[] | undefined = JSON.parse(localStorage.getItem('previousResults'));
    if(previousResults?.length){
      return previousResults;
    }else{
      localStorage.setItem('previousResults', JSON.stringify([]));
      return [];
    }
  }

  private filter(value: string): void {
    if(value) {
      this.filteredResults = this.previousResults.filter((result: string) => result.toLowerCase().includes(value.toLowerCase()));
    } else {
      this.filteredResults = this.previousResults;
      if(this.isResultPage) 
        this.store.dispatch(new GetFilteredWorkshops());
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
