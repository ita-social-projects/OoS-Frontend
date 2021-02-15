import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Login, Logout, CheckAuth, CheckAuthFail } from './user-registration.actions';

import { HttpClient } from '@angular/common/http';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import {MatSnackBar} from '@angular/material/snack-bar';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

export interface UserRegistrationStateModel {
  isAuthorized: boolean;
}

@State<UserRegistrationStateModel>({
  name: 'user',
  defaults: {
    isAuthorized: false
  }
})
@Injectable()
export class UserRegistrationState {
  constructor(
    public oidcSecurityService: OidcSecurityService,
    public http: HttpClient,
    private _snackBar: MatSnackBar) {}

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
      let isAuth: boolean;
      this.oidcSecurityService.checkAuth().subscribe(value => {
        isAuth = value;
      });
      if (isAuth) {
        this.oidcSecurityService.logoff();
        dispatch(new CheckAuth());
      }
  }
  @Action(CheckAuth)
  CheckAuth({ patchState, dispatch}: StateContext<UserRegistrationStateModel>): void {
    this.oidcSecurityService
      .checkAuth()
      .pipe(
        tap(response => {
          return response;
        }),
        catchError(err => {
          dispatch(new CheckAuthFail(err));
          return throwError(err);
          })
        )
      .subscribe((auth) => {
        console.log('is authenticated', auth)
        patchState({ isAuthorized: auth});
      });
      
  }
  
  @Action(CheckAuthFail)
  CheckAuthFail({ payload }: CheckAuthFail): void {
    this._snackBar.open(payload);
  }
}
