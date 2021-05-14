import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Login, Logout, CheckAuth, AuthFail, SetLocation, AuthSuccess } from './user.actions';

import { HttpClient } from '@angular/common/http';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import jwt_decode from 'jwt-decode';
import { MatSnackBar } from '@angular/material/snack-bar';
export interface UserStateModel {
  isAuthorized: boolean;
  userName: string;
  role: string;
  city: String;
  lng: Number | null;
  lat: Number | null;
}
@State<UserStateModel>({
  name: 'user',
  defaults: {
    isAuthorized: false,
    userName: '',
    role: '',
    city: "",
    lng: null,
    lat: null
  }
})
@Injectable()
export class UserRegistrationState {
  constructor(
    public oidcSecurityService: OidcSecurityService,
    public http: HttpClient, public snackBar: MatSnackBar,) { }

  @Selector()
  static isAuthorized(state: UserStateModel) {
    return state.isAuthorized;
  }
  @Selector()
  static userName(state: UserStateModel): string {
    return state.userName;
  }
  @Selector()
  static role(state: UserStateModel): string {
    return state.role;
  }
  @Action(Login)
  Login({ }: StateContext<UserStateModel>): void {
    this.oidcSecurityService.authorize();
  }
  @Action(Logout)
  Logout({ dispatch }: StateContext<UserStateModel>): void {
    this.oidcSecurityService.logoff();
    dispatch(new CheckAuth());
  }
  @Action(CheckAuth)
  CheckAuth({ patchState, dispatch }: StateContext<UserStateModel>): void {
    this.oidcSecurityService
      .checkAuth()
      .subscribe((auth) => {
        console.log('is authenticated', auth);
        patchState({ isAuthorized: auth });
        if (auth) {
          patchState({ role: jwt_decode(this.oidcSecurityService.getToken())['role'] });
          patchState({ userName: jwt_decode(this.oidcSecurityService.getToken())['name'] });
          dispatch(new AuthSuccess());
        }
      });
  }
  @Action(AuthFail)
  authFail(): void {
    console.log('Authorization failed');
    this.snackBar.open("Упс! Перевірте з'єднання", 'Добре', {
      duration: 5000,
      panelClass: ['red-snackbar'],
    });
  }
  @Action(AuthSuccess)
  authSuccess(): void {
    console.log('Authorization succeeded');
    this.snackBar.open("Ви успішно увійшли!", '', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['primary'],
    });
  }
  @Action(SetLocation)
  setLocation({ patchState }: StateContext<UserStateModel>, { payload }: SetLocation): void {
    patchState({ city: payload.city, lng: payload.lng, lat: payload.lat });
  }
}
