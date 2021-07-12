import { Component, OnInit, HostListener } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { RegistrationState } from '../shared/store/registration.state';
import { Observable } from 'rxjs';
import { Logout, CheckAuth, Login } from '../shared/store/registration.actions';
import { AppState } from '../shared/store/app.state';
import { User } from '../shared/models/user.model';
import { Router } from '@angular/router';
import { FilterState } from '../shared/store/filter.state';
import { NavigationState } from '../shared/store/navigation.state';
import { Navigation } from '../shared/models/navigation.model';

enum RoleLinks {
  provider = 'організацію',
  parent = 'дитину'
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  showModalReg = false;
  MobileView: boolean = false;

  @Select(FilterState.isLoading)
  isLoading$: Observable<boolean>;
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
    private router: Router) { }

  /**
   * @param event global variable window
   * method defined window.width and assign MobileView: boolean
   */
  isWindowMobile(event: any): void {
    this.MobileView = event.innerWidth <= 750;
  }

  @HostListener("window: resize", ["$event.target"])
  onResize(event: any): void {
    this.isWindowMobile(event);
  }

  ngOnInit(): void {
    this.store.dispatch(new CheckAuth());
    this.user$.subscribe(user => this.user = user);
    this.isWindowMobile(window);
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
}
