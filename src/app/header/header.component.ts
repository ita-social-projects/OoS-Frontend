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

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  readonly Languages: typeof Languages = Languages;
  selectedLanguage: string = 'uk';

  Role = Role;
  showModalReg = false;
  @Input() MobileScreen: boolean;

  @Select(FilterState.isLoading)
  isLoadingResultPage$: Observable<boolean>;
  @Select(UserState.isLoading)
  isLoadingCabinet$: Observable<boolean>;
  @Select(MetaDataState.isLoading)
  isLoadingDirections: Observable<boolean>;
  @Select(NavigationState.navigationPaths)
  navigationPaths$: Observable<Navigation[]>;
  @Select(RegistrationState.isAuthorized)
  isAuthorized$: Observable<boolean>;
  @Select(RegistrationState.user)
  user$: Observable<User>;
  user: User;
  roles = RoleLinks;


  constructor(
    public store: Store,
    private router: Router) {
  }

  changeView() {
    this.store.dispatch(new SidenavToggle());
  }

  ngOnInit(): void {
    this.store.dispatch(new CheckAuth());
    this.user$.subscribe(user => this.user = user);
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
