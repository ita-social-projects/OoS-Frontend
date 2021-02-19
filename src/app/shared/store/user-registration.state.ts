import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Login, Logout, CheckAuth, AuthFail } from './user-registration.actions';

import { HttpClient } from '@angular/common/http';
import { OidcSecurityService } from 'angular-auth-oidc-client';

export interface UserRegistrationStateModel {
  isAuthorized: boolean;
}

@State<UserRegistrationStateModel>({
  name: 'user',
  defaults: {
    isAuthorized: false,
  }
})
@Injectable()
export class UserRegistrationState {
  constructor(
    public oidcSecurityService: OidcSecurityService,
    public http: HttpClient) {}

  @Selector()
    static isAuthorized(state: UserRegistrationStateModel) {
    return state.isAuthorized;
  }

  @Action(Login)
  Login({  dispatch }: StateContext<UserRegistrationStateModel>): void {
    this.oidcSecurityService.authorize();
    dispatch(new CheckAuth()); 
  }
  @Action(Logout)
  Logout({  dispatch  }: StateContext<UserRegistrationStateModel>): void {
    this.oidcSecurityService.logoff();
    dispatch(new CheckAuth());
  }
  @Action(CheckAuth)
  CheckAuth({ patchState }: StateContext<UserRegistrationStateModel>): void {
    this.oidcSecurityService
      .checkAuth()
      .subscribe((auth) => {
        console.log('is authenticated', auth)
        patchState({ isAuthorized: auth});
      });
  }
  @Action(AuthFail)
  AuthFail(): void {
      console.log("Authorization failed");
    }
  }
