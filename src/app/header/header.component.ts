import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { RegistrationState } from '../shared/store/registration.state';
import { Observable } from 'rxjs';
import { Logout, CheckAuth, Login, CheckRegistration } from '../shared/store/registration.actions';
import { AppState } from '../shared/store/app.state';
import { User } from '../shared/models/user.model';
import { Router } from '@angular/router';
import { FilterState } from '../shared/store/filter.state';

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

  @Select(FilterState.isLoading)
  isLoading$: Observable<boolean>;
  @Select(RegistrationState.isAuthorized)
  isAuthorized$: Observable<boolean>;
  @Select(RegistrationState.user)
  user$: Observable<User>;
  user: User;
  roles = RoleLinks;

  constructor(
    public store: Store,
    private router: Router
    ) { }

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
    return this.router.url === route
  }
}
