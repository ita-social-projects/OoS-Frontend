import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Login, Logout, CheckAuth, AuthFail } from './user-registration.actions';
import { UsersService } from '../services/users/users.service';
import { HttpClient } from '@angular/common/http';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import jwt_decode from 'jwt-decode';
import { MatSnackBar } from '@angular/material/snack-bar';
import { from } from 'rxjs';

export interface UserRegistrationStateModel {
  isAuthorized: boolean;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  middleName: string;
}
@State<UserRegistrationStateModel>({
  name: 'user',
  defaults: {
    isAuthorized: false,
    email: '',
    role: '',
    firstName: '',
    lastName: '',
    middleName: '',
  }
})
@Injectable()
export class UserRegistrationState {
  constructor(
    public oidcSecurityService: OidcSecurityService,
    public http: HttpClient,
    public snackBar: MatSnackBar,
    public usersService: UsersService
  ) { }

  @Selector()
  static isAuthorized(state: UserRegistrationStateModel) {
    return state.isAuthorized;
  }
  @Selector()
  static userName(state: UserRegistrationStateModel): string {
    return `${state.lastName} ${state.firstName} ${state.middleName}`;
  }
  @Selector()
  static role(state: UserRegistrationStateModel): string {
    return state.role;
  }
  @Action(Login)
  Login({ dispatch }: StateContext<UserRegistrationStateModel>): void {
    this.oidcSecurityService.authorize();
  }
  @Action(Logout)
  Logout({ dispatch }: StateContext<UserRegistrationStateModel>): void {
    this.oidcSecurityService.logoff();
    dispatch(new CheckAuth());
  }
  @Action(CheckAuth)
  CheckAuth({ patchState }: StateContext<UserRegistrationStateModel>): void {
    this.oidcSecurityService
      .checkAuth()
      .subscribe((auth) => {
        console.log('is authenticated', auth);
        patchState({ isAuthorized: auth });
        if (auth) {
          const id = jwt_decode(this.oidcSecurityService.getToken())['sub'];
          patchState({ role: jwt_decode(this.oidcSecurityService.getToken())['role'] });
          this.usersService.getUserById(id).subscribe(user => {
            patchState({ email: user.email, firstName: user.firstName, lastName: user.lastName, middleName: user.middleName });
          });
        }
      });
  }
  @Action(AuthFail)
  AuthFail(): void {
    console.log('Authorization failed');
    this.snackBar.open("Упс! Перевірте з'єднання", 'Спробуйте ще раз!', {
      duration: 5000,
      panelClass: ['red-snackbar'],
    });
  }
}
