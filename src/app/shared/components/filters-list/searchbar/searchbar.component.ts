import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NavBarName } from 'src/app/shared/enum/navigation-bar';
import { Navigation } from 'src/app/shared/models/navigation.model';
import { SetSearchQueryValue } from 'src/app/shared/store/filter.actions';
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

  searchValue = new FormControl('', [Validators.maxLength(200)]);
  isResultPage = false;
  searchedText: string;

  @Select(NavigationState.navigationPaths)
  navigationPaths$: Observable<Navigation[]>;
  @Select(FilterState.searchQuery)
  searchQuery$: Observable<string>;
  destroy$: Subject<boolean> = new Subject<boolean>();

  ngOnInit(): void {
    this.navigationPaths$
      .pipe(takeUntil(this.destroy$))
      .subscribe((navigationPaths: Navigation[]) =>
        this.isResultPage = navigationPaths.some((path: Navigation) => path.name === NavBarName.TopWorkshops)
      );

    this.searchValue.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((val: string) => {
        this.searchedText = val;
        if (val.length === 0) {
          this.store.dispatch(new SetSearchQueryValue(''));
        }
      });

    this.searchQuery$
      .pipe(takeUntil(this.destroy$))
      .subscribe((text: string) => this.searchValue.setValue(text,{emitEvent: false}));
  }

  onSearch(): void {
    !this.isResultPage && this.router.navigate(['/result']);
    this.store.dispatch(new SetSearchQueryValue(this.searchedText || ''));
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
