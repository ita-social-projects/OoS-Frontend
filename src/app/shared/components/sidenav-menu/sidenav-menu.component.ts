import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { AdminTabTypes } from '../../enum/admins';
import { RoleLinks } from '../../enum/enumUA/user';
import { Languages } from '../../enum/languages';
import { Role } from '../../enum/role';
import { FeaturesList } from '../../models/featuresList.model';
import { User } from '../../models/user.model';
import { MetaDataState } from '../../store/meta-data.state';
import { SidenavToggle } from '../../store/navigation.actions';
import { NavigationState } from '../../store/navigation.state';
import { Login, Logout } from '../../store/registration.actions';
import { RegistrationState } from '../../store/registration.state';

@Component({
  selector: 'app-sidenav-menu',
  templateUrl: './sidenav-menu.component.html',
  styleUrls: ['./sidenav-menu.component.scss'],
})
export class SidenavMenuComponent implements OnInit, OnDestroy {
  readonly defaultAdminTabs = AdminTabTypes[0];
  readonly Languages: typeof Languages = Languages;
  readonly Role = Role;
  readonly RoleLinks = RoleLinks;
  readonly title = 'out-of-school';

  @Input() isMobileView: boolean;

  showModalReg = false;
  visibleSidenav: boolean;
  user: User;
  selectedLanguage: string;

  @Select(NavigationState.sidenavOpenTrue)
  sidenavOpenTrue$: Observable<boolean>;
  @Select(RegistrationState.user)
  user$: Observable<User>;
  @Select(RegistrationState.subrole)
  subrole$: Observable<string>;
  @Select(RegistrationState.isAuthorized)
  isAuthorized$: Observable<string>;
  @Select(MetaDataState.featuresList)
  featuresList$: Observable<FeaturesList>;

  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(public store: Store, private router: Router, private translate: TranslateService) {}

  changeView(): void {
    this.store.dispatch(new SidenavToggle());
  }

  ngOnInit(): void {
    this.selectedLanguage = localStorage.getItem('ui-culture') || 'uk';
    this.sidenavOpenTrue$.pipe(takeUntil(this.destroy$)).subscribe(visible => (this.visibleSidenav = visible));
    this.user$.pipe(filter(Boolean), takeUntil(this.destroy$)).subscribe((user: User) => {
      this.user = user;
    });
  }

  login(): void {
    this.store.dispatch(new Login(false));
  }

  logout(): void {
    this.store.dispatch(new Logout());
  }

  setLanguage(): void {
    this.translate.use(this.selectedLanguage);
    localStorage.setItem('ui-culture', this.selectedLanguage);
  }

  isRouter(route: string): boolean {
    return this.router.url === route;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
