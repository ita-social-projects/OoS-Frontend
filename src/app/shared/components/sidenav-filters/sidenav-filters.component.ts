import { Component, Input, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NavigationState } from 'src/app/shared/store/navigation.state';

@Component({
  selector: 'app-sidenav-filters',
  templateUrl: './sidenav-filters.component.html',
  styleUrls: ['./sidenav-filters.component.scss']
})
export class SidenavFiltersComponent implements OnInit {

  @Input() isMobileView: boolean;
  @Input() filtersList;

  @Select(NavigationState.filtersSidenavOpenTrue)
  filtersSidenavOpenTrue$: Observable<boolean>;

  visibleFiltersSidenav: boolean;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(public store: Store) { }

  ngOnInit(): void {
    
    this.filtersSidenavOpenTrue$
      .pipe(takeUntil(this.destroy$))
      .subscribe(visible => this.visibleFiltersSidenav = visible);
  }
  
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
