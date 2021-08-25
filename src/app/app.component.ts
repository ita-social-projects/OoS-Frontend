import { Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import { Navigation, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Languages } from './shared/enum/languages';
import { Role } from './shared/enum/role';
import { User } from './shared/models/user.model';
import { AppState } from './shared/store/app.state';
import { FilterState } from './shared/store/filter.state';
import { ChangeVisible } from './shared/store/navigation.actions';
import { NavigationState } from './shared/store/navigation.state';
import { CheckAuth, Login, Logout } from './shared/store/registration.actions';
import { RegistrationState } from './shared/store/registration.state';
import { UserState } from './shared/store/user.state';


enum RoleLinks {
  provider = 'організацію',
  parent = 'дитину'
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent implements OnInit, OnDestroy{

  readonly Languages: typeof Languages = Languages;
  selectedLanguage: string = 'uk'

  Role = Role;
  showModalReg = false;
  MobileView: boolean = false;

  title = 'out-of-school';
  visibleSideNav: boolean;

  @Select(NavigationState.isVisibleTrue)
  isVisibleTrue$: Observable<boolean>;
  @Select(RegistrationState.isAuthorized)
  isAuthorized$: Observable<boolean>;
  @Select(RegistrationState.user)
  user$: Observable<User>;
  user: User;
  roles = RoleLinks;

  destroy$: Subject<boolean> = new Subject<boolean>();


  constructor(
    public store: Store,
    private router: Router) {
  }

  changeView() {
    this.store.dispatch(new ChangeVisible());
  }

  isWindowMobile(event: any): void {
    this.MobileView = event.innerWidth <= 750;
  }

  @HostListener("window: resize", ["$event.target"])
  onResize(event: any): void {
    this.isWindowMobile(event);
  }

  ngOnInit(): void {
    this.user$.subscribe(user => this.user = user);
    this.isWindowMobile(window);
    this.isVisibleTrue$
      .pipe(takeUntil(this.destroy$))
      .subscribe(visible => this.visibleSideNav = visible)
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

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}


