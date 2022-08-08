import { AdminTabs } from './../shared/enum/enumUA/tech-admin/admin-tabs';
import { MetaDataState } from 'src/app/shared/store/meta-data.state';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { RegistrationState } from '../shared/store/registration.state';
import { combineLatest, Observable, Subject } from 'rxjs';
import { delay, filter, takeUntil } from 'rxjs/operators';
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
import { FeaturesList } from '../shared/models/featuresList.model';
import { AdminState } from '../shared/store/admin.state';
import { providerAdminRoleUkr } from '../shared/enum/enumUA/provider-admin';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  readonly Languages: typeof Languages = Languages;
  readonly Role: typeof Role = Role;
  readonly roles: typeof RoleLinks = RoleLinks;
  readonly defaultAdminTabs = AdminTabs[0];

  selectedLanguage = 'uk';
  showModalReg = false;
  userShortName: string = '';

  @Select(FilterState.isLoading)
  isLoadingResultPage$: Observable<boolean>;
  @Select(UserState.isLoading)
  isLoadingCabinet$: Observable<boolean>;
  @Select(MetaDataState.isLoading)
  isLoadingMetaData$: Observable<boolean>;
  @Select(AdminState.isLoading)
  isLoadingAdminData$: Observable<boolean>;
  @Select(NavigationState.navigationPaths)
  navigationPaths$: Observable<Navigation[]>;
  @Select(RegistrationState.isAuthorized)
  isAuthorized$: Observable<string>;
  @Select(AppState.isMobileScreen)
  isMobileScreen$: Observable<boolean>;
  @Select(RegistrationState.user)
  user$: Observable<User>;
  user: User;
  @Select(MetaDataState.featuresList)
  featuresList$: Observable<FeaturesList>;
  @Select(RegistrationState.subrole)
  subrole$: Observable<string>;

  isLoadingResultPage: boolean;
  isLoadingCabinet: boolean;
  isLoadingMetaData: boolean;
  isLoadingAdminData: boolean;
  isLoadingNotifications: boolean;
  navigationPaths: Navigation[];
  subrole: string;
  btnView: string = providerAdminRoleUkr.all;

  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private store: Store, private router: Router) {}

  changeView(): void {
    this.store.dispatch(new SidenavToggle());
  }

  ngOnInit(): void {
    combineLatest([
      this.subrole$,
      this.isLoadingResultPage$,
      this.isLoadingMetaData$,
      this.isLoadingCabinet$,
      this.isLoadingAdminData$,
      this.navigationPaths$
    ])
      .pipe(takeUntil(this.destroy$), delay(0))
      .subscribe(
        ([
          subrole,
          isLoadingResult,
          isLoadingMeta,
          isLoadingCabinet,
          isLoadingAdminData,
          navigationPaths
        ]) => {
          this.subrole = subrole;
          this.isLoadingResultPage = isLoadingResult;
          this.isLoadingMetaData = isLoadingMeta;
          this.isLoadingCabinet = isLoadingCabinet;
          this.isLoadingAdminData = isLoadingAdminData;
          this.navigationPaths = navigationPaths;
        }
      );

    this.store.dispatch(new CheckAuth());

    this.user$
      .pipe(
        filter((user) => !!user),
        takeUntil(this.destroy$)
      )
      .subscribe((user: User) => {
        this.userShortName = this.getFullName(user);
        this.user = user;
      });
  }

  private getFullName(user: User): string {
    return `${user.lastName} ${user.firstName.slice(0, 1)}.${
      user.middleName ? user.middleName.slice(0, 1) + '.' : ''
    }`;
  }

  logout(): void {
    this.store.dispatch(new Logout());
  }

  login(): void {
    this.store.dispatch(new Login(false));
  }

  isRouter(route: string): boolean {
    return this.router.url === route;
  }

  setLanguage(): void {
    localStorage.setItem('ui-culture', this.selectedLanguage);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
