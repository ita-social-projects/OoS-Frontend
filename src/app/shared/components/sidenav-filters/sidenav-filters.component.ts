import { Component, Input } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
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
}
