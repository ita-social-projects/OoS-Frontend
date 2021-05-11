import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Login, Logout, CheckAuth, AuthFail } from './user-registration.actions';

import { HttpClient } from '@angular/common/http';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import jwt_decode from 'jwt-decode';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface UserRegistrationStateModel {
  isAuthorized: boolean;
  userName: string;
  role: string;
  id: string;
}
@State<UserRegistrationStateModel>({
  name: 'user',
  defaults: {
    isAuthorized: false,
    userName: '',
    role: '',
    id: ''
  }
})
@Injectable()
export class UserRegistrationState {
  constructor(
    public oidcSecurityService: OidcSecurityService,
    public http: HttpClient, public snackBar: MatSnackBar,) { }

  @Selector()
  static isAuthorized(state: UserRegistrationStateModel) {
    return state.isAuthorized;
  }
  @Selector()
  static userName(state: UserRegistrationStateModel): string {
    return state.userName;
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
          patchState({ role: jwt_decode(this.oidcSecurityService.getToken())['role'] });
          patchState({ userName: jwt_decode(this.oidcSecurityService.getToken())['name'] });
          patchState({ id: jwt_decode(this.oidcSecurityService.getToken())['id'] });
        }
        console.log(jwt_decode(this.oidcSecurityService.getToken())['id']);
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
