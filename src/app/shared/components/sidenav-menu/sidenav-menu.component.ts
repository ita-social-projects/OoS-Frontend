import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { AdminTabTypes } from 'shared/enum/admins';
import { RoleLinks } from 'shared/enum/enumUA/user';
import { Languages } from 'shared/enum/languages';
import { Role } from 'shared/enum/role';
import { FeaturesList } from 'shared/models/features-list.model';
import { User } from 'shared/models/user.model';
import { MetaDataState } from 'shared/store/meta-data.state';
import { SidenavToggle } from 'shared/store/navigation.actions';
import { NavigationState } from 'shared/store/navigation.state';
import { Login, Logout } from 'shared/store/registration.actions';
import { RegistrationState } from 'shared/store/registration.state';
import { isRoleProvider } from 'shared/utils/provider.utils';

@Component({
  selector: 'app-sidenav-menu',
  templateUrl: './sidenav-menu.component.html',
  styleUrls: ['./sidenav-menu.component.scss']
})
export class SidenavMenuComponent implements OnInit, OnDestroy {
  @Input() public isMobileView: boolean;

  @Select(NavigationState.sidenavOpenTrue)
  public sidenavOpenTrue$: Observable<boolean>;
  @Select(RegistrationState.user)
  public user$: Observable<User>;
  @Select(RegistrationState.isAuthorized)
  public isAuthorized$: Observable<string>;
  @Select(MetaDataState.featuresList)
  public featuresList$: Observable<FeaturesList>;

  public readonly defaultAdminTabs = AdminTabTypes.AboutPortal;
  public readonly Languages: typeof Languages = Languages;
  public readonly Role = Role;
  public readonly RoleLinks = RoleLinks;
  public readonly title = 'out-of-school';
  public readonly isRoleProvider = isRoleProvider;

  public showModalReg = false;
  public visibleSidenav: boolean;
  public user: User;
  public selectedLanguage: string;

  public destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    public store: Store,
    private router: Router,
    private translate: TranslateService,
    private dateAdapter: DateAdapter<Date>
  ) {}

  public changeView(): void {
    this.store.dispatch(new SidenavToggle());
  }

  public ngOnInit(): void {
    this.selectedLanguage = localStorage.getItem('ui-culture') || 'uk';
    this.sidenavOpenTrue$.pipe(takeUntil(this.destroy$)).subscribe((visible) => (this.visibleSidenav = visible));
    this.user$.pipe(filter(Boolean), takeUntil(this.destroy$)).subscribe((user: User) => {
      this.user = user;
    });
  }

  public login(): void {
    this.store.dispatch(new Login(false));
  }

  public logout(): void {
    this.store.dispatch(new Logout());
  }

  public setLanguage(): void {
    this.translate.use(this.selectedLanguage);
    this.dateAdapter.setLocale(this.selectedLanguage);
    localStorage.setItem('ui-culture', this.selectedLanguage);
  }

  public isRouter(route: string): boolean {
    return this.router.url === route;
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
