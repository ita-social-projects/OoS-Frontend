import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { CallApi, Login, Logout, CheckAuth, CheckAuthFail } from './user-registration.actions';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    public http: HttpClient,
    public snackBar: MatSnackBar
    ) {}

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
  @Action(CallApi)
    CallApi(): void {
      const token = this.oidcSecurityService.getToken();

      this.http.get('http://localhost:5000/Organization/TestOk', {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
        responseType: 'text'
      })
        .subscribe((data: any) => {
          console.log('api result:', data);
        });
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
  @Action(CheckAuthFail)
  CheckAuthFail({ payload }: CheckAuthFail): void {
    this.snackBar.open('Check your connection', "Try again!", {
      duration: 5000,
      panelClass: ['red-snackbar'],
      });
  }
}
