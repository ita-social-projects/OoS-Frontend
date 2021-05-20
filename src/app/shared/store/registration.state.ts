import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Login, Logout, CheckAuth, OnAuthFail } from './registration.actions';

import { HttpClient } from '@angular/common/http';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import jwt_decode from 'jwt-decode';
import { MatSnackBar } from '@angular/material/snack-bar';
export interface RegistrationStateModel {
  isAuthorized: boolean;
  userName: string;
  role: string;
}
@State<RegistrationStateModel>({
  name: 'registration',
  defaults: {
    isAuthorized: false,
    userName: '',
    role: '',
  }
})
@Injectable()
export class RegistrationState {
  @Selector()
  static isAuthorized(state: RegistrationStateModel): boolean {
    return state.isAuthorized;
  }
  @Selector()
  static userName(state: RegistrationStateModel): string {
    return state.userName;
  }
  @Selector()
  static role(state: RegistrationStateModel): string {
    return state.role;
  }

  constructor(
    public oidcSecurityService: OidcSecurityService,
    public http: HttpClient,
    public snackBar: MatSnackBar) { }

  @Action(Login)
  Login({ }: StateContext<RegistrationStateModel>): void {
    this.oidcSecurityService.authorize();
  }
  @Action(Logout)
  Logout({ dispatch }: StateContext<RegistrationStateModel>): void {
    this.oidcSecurityService.logoff();
    dispatch(new CheckAuth());
  }
  @Action(CheckAuth)
  CheckAuth({ patchState }: StateContext<RegistrationStateModel>): void {
    this.oidcSecurityService
      .checkAuth()
      .subscribe((auth) => {
        console.log('is authenticated', auth);
        patchState({ isAuthorized: auth });
        if (auth) {
          patchState({ role: jwt_decode(this.oidcSecurityService.getToken())['role'] });
          patchState({ userName: jwt_decode(this.oidcSecurityService.getToken())['name'] });
        }
      });
  }
  @Action(OnAuthFail)
  onAuthFail(): void {
    console.log('Authorization failed');
    this.snackBar.open("Упс! Перевірте з'єднання", '', {
      duration: 5000,
      panelClass: ['red-snackbar'],
    });
  }

}
