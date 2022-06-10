import { Component, Input, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NavigationState } from 'src/app/shared/store/navigation.state';
import { FilterState } from '../../store/filter.state';

@Component({
  selector: 'app-sidenav-filters',
  templateUrl: './sidenav-filters.component.html',
  styleUrls: ['./sidenav-filters.component.scss']
})
export class SidenavFiltersComponent implements OnInit {
  @Select(FilterState.filterList)
  filterList$: Observable<any>;
  @Select(NavigationState.filtersSidenavOpenTrue)
  filtersSidenavOpenTrue$: Observable<boolean>;
  visibleFiltersSidenav: boolean;

  @Input() isMobileView: boolean;

  destroy$: Subject<boolean> = new Subject<boolean>();
  filtersList;

  constructor(public store: Store) { }

  ngOnInit(): void {
    this.filterList$
    .pipe(takeUntil(this.destroy$))
    .subscribe((list) => {
      const { withDisabilityOption, ageFilter, categoryCheckBox, priceFilter, workingHours, order } = list;
      this.filtersList = { withDisabilityOption, ageFilter, categoryCheckBox, priceFilter, workingHours };
      // this.order = order;
    })
    
    this.filtersSidenavOpenTrue$
      .pipe(takeUntil(this.destroy$))
      .subscribe(visible => this.visibleFiltersSidenav = visible);
  }
  
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
