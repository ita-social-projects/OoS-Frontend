import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector, Store } from '@ngxs/store';
import { Login, Logout, CheckAuth, OnAuthFail, CheckRegistration, GetProfile, RegisterUser } from './registration.actions';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import jwt_decode from 'jwt-decode';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../models/user.model';
import { ProviderService } from '../services/provider/provider.service';
import { ParentService } from '../services/parent/parent.service';
import { Parent } from '../models/parent.model';
import { tap } from 'rxjs/operators';
import { Provider } from '../models/provider.model';
import { Router } from '@angular/router';

import { Role } from '../enum/role';
import { UserService } from '../services/user/user.service';
import { CreateParent } from './user.actions';

export interface RegistrationStateModel {
  isAuthorized: boolean;
  user: User;
  checkSessionChanged: boolean,
  provider: Provider;
  parent: Parent;
}

@State<RegistrationStateModel>({
  name: 'registration',
  defaults: {
    isAuthorized: false,
    user: undefined,
    checkSessionChanged: false,
    provider: undefined,
    parent: undefined
  }
})

@Injectable()
export class RegistrationState {
  @Selector()
  static isAuthorized(state: RegistrationStateModel): boolean {
    return state.isAuthorized;
  }
  @Selector()
  static isRegistered(state: RegistrationStateModel): boolean {
    return state.user.isRegistered;
  }
  @Selector()
  static user(state: RegistrationStateModel): User {
    return state.user;
  }

  @Selector()
  static provider(state: RegistrationStateModel): Provider {
    return state.provider;
  }

  @Selector()
  static parent(state: RegistrationStateModel): Parent {
    return state.parent
  }

  constructor(
    private oidcSecurityService: OidcSecurityService,
    private snackBar: MatSnackBar,
    private userService: UserService,
    private providerService: ProviderService,
    private parentService: ParentService,
    private store: Store,
    private router: Router
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
  CheckAuth({ patchState, dispatch }: StateContext<RegistrationStateModel>): void {
    this.oidcSecurityService
      .checkAuth()
      .subscribe((auth) => {
        console.log('is authenticated', auth);
        patchState({ isAuthorized: auth });
        if (auth) {
          const id = jwt_decode(this.oidcSecurityService.getToken())['sub'];
          this.userService.getUserById(id).subscribe(user => {
            patchState({ user: user });
            dispatch(new CheckRegistration());
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

  @Action(CheckRegistration)
  checkRegistration({ dispatch, getState }: StateContext<RegistrationStateModel>): void {
    const state = getState();

    if (state.user.isRegistered) {
      dispatch(new GetProfile());
    } else {
      (state.user.role === Role.provider) ? this.router.navigate(['/create-provider']) : dispatch(new CreateParent(state.user));
    }
  }

  @Action(GetProfile)
  getProfile({ patchState, getState }: StateContext<RegistrationStateModel>, { }: GetProfile) {
    const state = getState();

    if (state.user.role === Role.parent) {
      return this.parentService
        .getProfile()
        .pipe(
          tap(
            (parent: Parent) => patchState({ parent: parent })
          ));
    } else {
      return this.providerService
        .getProfile()
        .pipe(
          tap(
            (provider: Provider) => patchState({ provider: provider })
          ));
    }
  }

  @Action(RegisterUser)
  registerUser({ }: StateContext<RegistrationStateModel>, { }: RegisterUser) { }
}
