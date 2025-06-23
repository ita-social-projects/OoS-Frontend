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
export class SidenavFiltersComponent {
  @Select(NavigationState.filtersSidenavOpenTrue)
  public isFiltersSidenavOpen$: Observable<boolean>;

  @Input() public isMobileView: boolean;

  public destroy$: Subject<boolean> = new Subject<boolean>();
}
