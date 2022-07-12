import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { AdminTabs } from '../../enum/enumUA/tech-admin/admin-tabs';
import { Languages } from '../../enum/languages';
import { Role, RoleLinks } from '../../enum/role';
import { FeaturesList } from '../../models/featuresList.model';
import { User } from '../../models/user.model';
import { MetaDataState } from '../../store/meta-data.state';
import { SidenavToggle } from '../../store/navigation.actions';
import { NavigationState } from '../../store/navigation.state';
import { Login, Logout } from '../../store/registration.actions';
import { RegistrationState } from '../../store/registration.state';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit, OnDestroy {
  readonly defaultAdminTabs = AdminTabs[0];
  readonly Languages: typeof Languages = Languages;
  selectedLanguage: string;

  @Input() isMobileView: boolean;

  Role = Role;
  roles = RoleLinks;
  showModalReg = false;
  title = 'out-of-school';
  visibleSidenav: boolean;
  user: User;

  @Select(NavigationState.sidenavOpenTrue)
  sidenavOpenTrue$: Observable<boolean>;
  @Select(RegistrationState.user)
  user$: Observable<User>;
  @Select(RegistrationState.isAuthorized)
  isAuthorized$: Observable<string>;
  @Select(MetaDataState.featuresList)
  featuresList$: Observable<FeaturesList>;

  destroy$: Subject<boolean> = new Subject<boolean>();


  constructor(
    public store: Store,
    private router: Router) {
  }

  changeView(): void {
    this.store.dispatch(new SidenavToggle());
  }

  ngOnInit(): void {
    this.selectedLanguage = localStorage.getItem('ui-culture') || 'uk';
    this.sidenavOpenTrue$
      .pipe(takeUntil(this.destroy$))
      .subscribe(visible => this.visibleSidenav = visible);
      this.user$.pipe(
        filter((user) => !!user),
        takeUntil(this.destroy$)
      ).subscribe((user: User) => {
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
