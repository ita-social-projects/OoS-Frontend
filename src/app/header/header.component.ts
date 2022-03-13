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
import { NotificationsState } from '../shared/store/notifications.state';
import { FeaturesList } from '../shared/models/featuresList.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  readonly Languages: typeof Languages = Languages;
  readonly Role: typeof Role = Role;
  readonly roles: typeof RoleLinks = RoleLinks;

  selectedLanguage = 'uk';
  showModalReg = false;
  userShortName: string = '';

  @Select(FilterState.isLoading)
  isLoadingResultPage$: Observable<boolean>;
  @Select(UserState.isLoading)
  isLoadingCabinet$: Observable<boolean>;
  @Select(MetaDataState.isLoading)
  isLoadingMetaData$: Observable<boolean>;
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

  isLoadingResultPage: boolean;
  isLoadingCabinet: boolean;
  isLoadingMetaData: boolean;
  isLoadingNotifications: boolean;
  isMobile: boolean;
  navigationPaths: Navigation[];

  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private store: Store,
    private router: Router) {
  }

  changeView(): void {
    this.store.dispatch(new SidenavToggle());
  }

  ngOnInit(): void {
    combineLatest([this.isLoadingResultPage$, this.isLoadingMetaData$, this.isLoadingCabinet$])
      .pipe(takeUntil(this.destroy$), delay(0))
      .subscribe(([isLoadingResult, isLoadingMeta, isLoadingCabinet]) => {
        this.isLoadingResultPage = isLoadingResult;
        this.isLoadingMetaData = isLoadingMeta;
        this.isLoadingCabinet = isLoadingCabinet;
      });

    combineLatest([this.isMobileScreen$, this.navigationPaths$])
      .pipe(takeUntil(this.destroy$), delay(0))
      .subscribe(([isMobile, navigationPaths]) => {
        this.isMobile = isMobile;
        this.navigationPaths = navigationPaths;
      })

    this.store.dispatch(new CheckAuth());

    this.user$.pipe(
      filter((user) => !!user),
      takeUntil(this.destroy$)
    ).subscribe((user: User) => {
      this.userShortName = this.getFullName(user);
    });
  }

  private getFullName(user: User): string {
    return user.lastName + ' ' + (user.firstName).slice(0, 1) + '.' + (user.middleName).slice(0, 1) + '.';
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
