import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { UsersService } from '../services/users/users.service';
import { Login, Logout, CheckAuth, OnAuthFail } from './registration.actions';
import { HttpClient } from '@angular/common/http';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import jwt_decode from 'jwt-decode';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface RegistrationStateModel {
  isAuthorized: boolean;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  middleName: string;
}

@State<RegistrationStateModel>({
  name: 'registration',
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
export class RegistrationState {
  @Selector()
  static isAuthorized(state: RegistrationStateModel): boolean {
    return state.isAuthorized;
  }
  @Selector()
  static userName(state: RegistrationStateModel): string {
    return `${state.lastName} ${state.firstName} ${state.middleName}`;
  }
  @Selector()
  static role(state: RegistrationStateModel): string {
    return state.role;
  }

  constructor(
    public oidcSecurityService: OidcSecurityService,
    public http: HttpClient,
    public snackBar: MatSnackBar,
    public usersService: UsersService
  ) { }

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
          const id = jwt_decode(this.oidcSecurityService.getToken())['sub'];
          this.usersService.getUserById(id).subscribe(user => {
            patchState({
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              middleName: user.middleName,
              role: user.role
            });
          });
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
