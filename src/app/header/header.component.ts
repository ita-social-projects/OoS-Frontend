import { MetaDataState } from 'src/app/shared/store/meta-data.state';
import { Component, OnInit, Input } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { RegistrationState } from '../shared/store/registration.state';
import { Observable } from 'rxjs';
import { Logout, CheckAuth, Login } from '../shared/store/registration.actions';
import { User } from '../shared/models/user.model';
import { Router } from '@angular/router';
import { FilterState } from '../shared/store/filter.state';
import { NavigationState } from '../shared/store/navigation.state';
import { UserState } from '../shared/store/user.state';
import { Navigation } from '../shared/models/navigation.model';
import { Role, RoleLinks } from '../shared/enum/role';
import { Languages } from '../shared/enum/languages';
import { SidenavToggle } from '../shared/store/navigation.actions';
import { AppState } from '../shared/store/app.state';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() isMobileView: boolean;

  readonly Languages: typeof Languages = Languages;
  readonly Role: typeof Role = Role;
  readonly roles: typeof RoleLinks = RoleLinks;

  selectedLanguage = 'uk';
  showModalReg = false;

  @Select(FilterState.isLoading)
  isLoadingResultPage$: Observable<boolean>;
  @Select(UserState.isLoading)
  isLoadingCabinet$: Observable<boolean>;
  @Select(MetaDataState.isLoading)
  isLoadingDirections: Observable<boolean>;
  @Select(NavigationState.navigationPaths)
  navigationPaths$: Observable<Navigation[]>;
  @Select(RegistrationState.isAuthorized)
  isAuthorized$: Observable<string>;
  @Select(RegistrationState.user)
  user$: Observable<User>;
  user: User;

  constructor(
    public store: Store,
    private router: Router) {
  }

  changeView(): void {
    this.store.dispatch(new SidenavToggle());
  }

  ngOnInit(): void {
    this.store.dispatch(new CheckAuth());
  }

  logout(): void {
    this.store.dispatch(new Logout());
  }

  login(): void {
    this.store.dispatch(new Login());
  }

  isRouter(route: string): boolean {
    return this.router.url === route;
  }

  setLanguage(): void {
    localStorage.setItem('ui-culture', this.selectedLanguage);
  }

}
