import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, startWith, takeUntil } from 'rxjs/operators';
import { NavBarName } from 'src/app/shared/enum/navigation-bar';
import { Navigation } from 'src/app/shared/models/navigation.model';
import { SetSearchQueryValue } from 'src/app/shared/store/filter.actions';
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

  searchValue = new FormControl('', [Validators.maxLength(200), this.searchValidator]);
  isResultPage: boolean = false;

  @Select(NavigationState.navigationPaths)
  navigationPaths$: Observable<Navigation[]>;
  destroy$: Subject<boolean> = new Subject<boolean>();

  ngOnInit(): void {
    this.navigationPaths$.pipe(
      takeUntil(this.destroy$),
    ).subscribe((navigationPaths: Navigation[]) => this.isResultPage = navigationPaths.some((path: Navigation) => path.name === NavBarName.TopWorkshops));

    this.searchValue.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        distinctUntilChanged(),
        startWith('')
      ).subscribe(val => {
        !this.isResultPage && this.store.dispatch(new SetSearchQueryValue(val || ''));
      })
  }

  onSerch(value: string): void {
    !this.isResultPage && this.router.navigate(['/result']);

    this.store.dispatch(new SetSearchQueryValue(value || ''));
  }

  searchValidator(control: FormControl): object | null {
    let value = control.value;
    if (value && !/^[а-яА-ЯІі\- a-zA-Z\s ]*$/.test(value)) {
      return {
        isInvalid: true
      }
    }
    return null;
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
