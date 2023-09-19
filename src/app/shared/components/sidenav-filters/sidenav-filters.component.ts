import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NavigationState } from '../../store/navigation.state';

@Component({
  selector: 'app-sidenav-filters',
  templateUrl: './sidenav-filters.component.html',
  styleUrls: ['./sidenav-filters.component.scss']
})
export class SidenavFiltersComponent implements OnInit, OnDestroy {
  @Select(NavigationState.filtersSidenavOpenTrue)
  public filtersSidenavOpenTrue$: Observable<boolean>;
  public visibleFiltersSidenav: boolean;

  @Input() public isMobileView: boolean;

  public destroy$: Subject<boolean> = new Subject<boolean>();

  constructor() {}

  public ngOnInit(): void {
    this.filtersSidenavOpenTrue$.pipe(takeUntil(this.destroy$)).subscribe((visible) => (this.visibleFiltersSidenav = visible));
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
