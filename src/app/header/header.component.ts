import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { RegistrationState } from '../shared/store/registration.state';
import { Observable } from 'rxjs';
import { Logout, CheckAuth, Login } from '../shared/store/registration.actions';
import { AppState } from '../shared/store/app.state';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  user = {
    firstName: 'Іванов В. М'
  };
  showModalReg = false;

  @Select(RegistrationState.isAuthorized)
  isAuthorized$: Observable<boolean>;
  @Select(RegistrationState.userName)
  userName$: Observable<string>;
  @Select(RegistrationState.role)
  userRole$: Observable<string>;
  @Select(AppState.isMainPage)
  isMainPage$: Observable<boolean>;
  @Select(AppState.isLoading)
  isLoading$: Observable<boolean>;
  role: string;

  constructor(public store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(new CheckAuth());
    this.userRole$.subscribe(value => {
      this.role = value;
    });
  }
  logout(): void {
    this.store.dispatch(new Logout());
  }
  login(): void {
    this.store.dispatch(new Login());
  }
}
