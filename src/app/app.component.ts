import { Component, OnDestroy, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Select } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NavigationState } from './shared/store/navigation.state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent implements OnDestroy{
  title = 'out-of-school';
  visibleSideNav: boolean;

  @Select(NavigationState.isVisibleTrue)
  isVisibleTrue$: Observable<boolean>;

  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor() {
    this.isVisibleTrue$
      .pipe(takeUntil(this.destroy$))
      .subscribe(visible => this.visibleSideNav = visible)
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}


