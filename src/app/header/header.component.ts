import { Component, OnDestroy, OnInit } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { delay, filter, takeUntil } from 'rxjs/operators';

import { ModeConstants } from 'shared/constants/constants';
import { AdminTabTypes } from 'shared/enum/admins';
import { RoleLinks } from 'shared/enum/enumUA/user';
import { Languages } from 'shared/enum/languages';
import { Role } from 'shared/enum/role';
import { CompanyInformation } from 'shared/models/company-information.model';
import { FeaturesList } from 'shared/models/features-list.model';
import { Navigation } from 'shared/models/navigation.model';
import { User } from 'shared/models/user.model';
import { AppState } from 'shared/store/app.state';
import { GetMainPageInfo } from 'shared/store/main-page.actions';
import { MainPageState } from 'shared/store/main-page.state';
import { MetaDataState } from 'shared/store/meta-data.state';
import { SidenavToggle } from 'shared/store/navigation.actions';
import { NavigationState } from 'shared/store/navigation.state';
import { Login, Logout } from 'shared/store/registration.actions';
import { RegistrationState } from 'shared/store/registration.state';
import { isRoleAdmin } from 'shared/utils/admin.utils';
import { isRoleProvider } from 'shared/utils/provider.utils';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Select(RegistrationState.isAuthorizationLoading)
  public isAuthorizationLoading$: Observable<boolean>;
  @Select(RegistrationState.isRegistered)
  public isRegistered$: Observable<boolean>;
  @Select(NavigationState.navigationPaths)
  public navigationPaths$: Observable<Navigation[]>;
  @Select(RegistrationState.isAuthorized)
  public isAuthorized$: Observable<string>;
  @Select(AppState.isMobileScreen)
  public isMobileScreen$: Observable<boolean>;
  @Select(RegistrationState.user)
  public user$: Observable<User>;
  @Select(MetaDataState.featuresList)
  public featuresList$: Observable<FeaturesList>;
  @Select(MainPageState.headerInfo)
  public headerInfo$: Observable<CompanyInformation>;

  public readonly defaultAdminTab = AdminTabTypes.AboutPortal;
  public readonly Languages = Languages;
  public readonly Role = Role;
  public readonly RoleLinks = RoleLinks;
  public readonly ModeConstants = ModeConstants;
  public readonly isRoleAdmin = isRoleAdmin;
  public readonly isRoleProvider = isRoleProvider;

  public selectedLanguage = localStorage.getItem('ui-culture');
  public showModalReg = false;
  public userShortName = '';
  public isMobileScreen: boolean;
  public user: User;
  public headerTitle: string;
  public headerSubtitle: string;
  public navigationPaths: Navigation[];
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private store: Store,
    private router: Router,
    private translate: TranslateService,
    private dateAdapter: DateAdapter<Date>
  ) {}

  public ngOnInit(): void {
    this.store.dispatch(new GetMainPageInfo());

    this.navigationPaths$.pipe(takeUntil(this.destroy$), delay(0)).subscribe((navigationPaths) => {
      this.navigationPaths = navigationPaths;
    });

    this.isMobileScreen$.pipe(takeUntil(this.destroy$)).subscribe((isMobileScreen: boolean) => (this.isMobileScreen = isMobileScreen));

    this.user$.pipe(filter(Boolean), takeUntil(this.destroy$)).subscribe((user: User) => {
      this.userShortName = this.getFullName(user);
      this.user = user;
    });

    this.headerInfo$.pipe(filter(Boolean), takeUntil(this.destroy$)).subscribe((headerInfo: CompanyInformation) => {
      this.headerTitle = headerInfo.title;
      this.headerSubtitle = headerInfo.companyInformationItems[0].sectionName;
    });
  }

  public onViewChange(): void {
    this.store.dispatch(new SidenavToggle());
  }

  public onLogin(): void {
    this.store.dispatch(new Login(false));
  }

  public onLogout(): void {
    this.store.dispatch(new Logout());
  }

  public isRouter(route: string): boolean {
    return this.router.url === route;
  }

  public setLanguage(): void {
    this.translate.use(this.selectedLanguage);
    this.dateAdapter.setLocale(this.selectedLanguage);
    localStorage.setItem('ui-culture', this.selectedLanguage);
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  private getFullName(user: User): string {
    return `${user.lastName} ${user.firstName.slice(0, 1)}.${user.middleName ? user.middleName.slice(0, 1) + '.' : ' '}`;
  }
}
