import { Location } from '@angular/common';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { LoginResponse, OidcSecurityService } from 'angular-auth-oidc-client';
import { Observable, of, throwError } from 'rxjs';
import { catchError, finalize, switchMap, tap } from 'rxjs/operators';

import { ModeConstants } from 'shared/constants/constants';
import { SnackbarText } from 'shared/enum/enumUA/message-bar';
import { Role } from 'shared/enum/role';
import { AreaAdmin } from 'shared/models/area-admin.model';
import { Employee } from 'shared/models/employee.model';
import { MinistryAdmin } from 'shared/models/ministry-admin.model';
import { Parent } from 'shared/models/parent.model';
import { Provider } from 'shared/models/provider.model';
import { RegionAdmin } from 'shared/models/region-admin.model';
import { TechAdmin } from 'shared/models/tech-admin.model';
import { User } from 'shared/models/user.model';
import { UserService } from 'shared/services/user/user.service';
import { UserProfileService } from 'shared/services/user/user-profile.service';
import { ClearPersonalInfo, ClearProfile, MarkFormDirty, SetPersonalInfo, SetProfile, ShowMessageBar } from './app.actions';
import {
  CheckAuth,
  CheckRegistration,
  GetProfile,
  GetUserPersonalInfo,
  Login,
  Logout,
  OnAuthFail,
  OnUpdateUserFail,
  OnUpdateUserSuccess,
  UpdateUser
} from './registration.actions';
import { AppState } from './app.state';

export interface RegistrationStateModel {
  isAuthorized: boolean;
  isLoading: boolean;
  isAuthorizationLoading: boolean;
  user: User;
  provider: Provider;
  employee: Employee;
  parent: Parent;
  techAdmin: TechAdmin;
  ministryAdmin: MinistryAdmin;
  regionAdmin: RegionAdmin;
  areaAdmin: AreaAdmin;
  role: Role;
}

@State<RegistrationStateModel>({
  name: 'registration',
  defaults: {
    isAuthorized: false,
    isAuthorizationLoading: true,
    isLoading: false,
    user: undefined,
    provider: undefined,
    employee: undefined,
    parent: undefined,
    techAdmin: undefined,
    regionAdmin: undefined,
    ministryAdmin: undefined,
    areaAdmin: undefined,
    role: Role.unauthorized
  }
})
@Injectable()
export class RegistrationState {
  private firstLogin: boolean = false;

  constructor(
    private store: Store,
    private router: Router,
    private location: Location,
    private oidcSecurityService: OidcSecurityService,
    private userService: UserService,
    private userProfileService: UserProfileService
  ) {}

  @Selector()
  static isAuthorized(state: RegistrationStateModel): boolean {
    return state.isAuthorized;
  }

  @Selector()
  static isAuthorizationLoading(state: RegistrationStateModel): boolean {
    return state.isAuthorizationLoading;
  }

  @Selector()
  static isLoading(state: RegistrationStateModel): boolean {
    return state.isLoading;
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
  static employee(state: RegistrationStateModel): Employee {
    return state.employee;
  }

  @Selector()
  static parent(state: RegistrationStateModel): Parent {
    return state.parent;
  }

  @Selector()
  static role(state: RegistrationStateModel): Role | undefined {
    return state.role;
  }

  @Action(Login)
  login(_ctx: StateContext<RegistrationStateModel>, { payload }: Login): void {
    const configIdOrNull = null;
    this.oidcSecurityService.authorize(configIdOrNull, {
      customParams: {
        culture: localStorage.getItem('ui-culture'),
        'ui-culture': localStorage.getItem('ui-culture'),
        ProviderRegistration: payload
      }
    });
  }

  @Action(Logout)
  logout(_ctx: StateContext<RegistrationStateModel>): Observable<unknown> {
    return this.oidcSecurityService.logoff();
  }

  @Action(CheckAuth)
  checkAuth({ patchState, dispatch }: StateContext<RegistrationStateModel>): Observable<void> {
    this.firstLogin = Boolean(new URLSearchParams(window.location.search).size);
    return this.oidcSecurityService.checkAuth().pipe(
      switchMap((auth: LoginResponse) => {
        patchState({ isAuthorized: auth.isAuthenticated });
        if (auth.isAuthenticated) {
          return dispatch(new GetUserPersonalInfo()).pipe(switchMap(() => dispatch(new CheckRegistration())));
        } else {
          dispatch(new ClearProfile());
          dispatch(new ClearPersonalInfo());
          patchState({ role: Role.unauthorized, isAuthorizationLoading: false });
          return of(null);
        }
      })
    );
  }

  @Action(OnAuthFail)
  onAuthFail({ dispatch }: StateContext<RegistrationStateModel>): void {
    // eslint-disable-next-line @typescript-eslint/quotes
    dispatch(new ShowMessageBar({ message: "Упс! Перевірте з'єднання", type: 'error' }));
  }

  @Action(CheckRegistration)
  checkRegistration({ dispatch, getState, patchState }: StateContext<RegistrationStateModel>): void {
    const state = getState();
    if (state.user.isRegistered) {
      dispatch(new GetProfile());
      if (
        this.firstLogin &&
        (state.user.role === Role.provider || state.user.role === Role.providerDeputy || state.user.role === Role.employee)
      ) {
        this.router.navigate(['/personal-cabinet/config']);
      }
    } else {
      this.router
        .navigate([state.user.role === Role.parent ? '/create-parent' : '/create-provider', ModeConstants.NEW])
        .finally(() => patchState({ isAuthorizationLoading: false }));
    }
  }

  @Action(GetProfile)
  getProfile({
    dispatch,
    patchState,
    getState
  }: StateContext<RegistrationStateModel>): Observable<Parent | Provider | Employee | MinistryAdmin | RegionAdmin | AreaAdmin> {
    const state = getState();
    const role = state.user.role as Role;
    const profileKey = this.userProfileService.getStateKeyByRole(role);

    patchState({ isAuthorizationLoading: true, role });

    const cachedProfile = this.store.selectSnapshot(AppState.profile);

    // if there is cached user profile
    if (cachedProfile) {
      patchState({ [profileKey]: cachedProfile, isAuthorizationLoading: false });
      return;
    }

    const profileObservable = this.userProfileService.getProfileObservableByRole(role, state.user.id);
    if (!profileObservable) {
      patchState({ isAuthorizationLoading: false });
      return;
    }

    return profileObservable.pipe(
      tap((profile: Parent | Provider | Employee | MinistryAdmin | RegionAdmin | AreaAdmin) => {
        dispatch(new SetProfile(profile));
        patchState({ [profileKey]: profile });
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === HttpStatusCode.Unauthorized || error.status === HttpStatusCode.Forbidden) {
          this.router.navigate(['/forbidden']);
        }
        return throwError(() => error);
      }),
      finalize(() => patchState({ isAuthorizationLoading: false }))
    );
  }

  @Action(GetUserPersonalInfo)
  getUserPersonalInfo({ patchState, dispatch }: StateContext<RegistrationStateModel>): Observable<User> | void {
    patchState({ isLoading: true });

    const cachedPersonalInfo = this.store.selectSnapshot(AppState.personalInfo);

    if (cachedPersonalInfo) {
      patchState({ user: cachedPersonalInfo, role: cachedPersonalInfo.role as Role, isLoading: false });
      return;
    }

    return this.userService.getPersonalInfo().pipe(
      tap((user: User) => {
        dispatch(new SetPersonalInfo(user));
        patchState({ user, role: user.role as Role, isLoading: false });
      })
    );
  }

  @Action(UpdateUser)
  updateUser({ dispatch }: StateContext<RegistrationStateModel>, { user }: UpdateUser): Observable<User | void> {
    return this.userService.updatePersonalInfo(user).pipe(
      tap(() => dispatch(new OnUpdateUserSuccess())),
      catchError((error: HttpErrorResponse) => dispatch(new OnUpdateUserFail(error)))
    );
  }

  @Action(OnUpdateUserFail)
  onUpdateUserFail({ dispatch }: StateContext<RegistrationStateModel>): void {
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }

  @Action(OnUpdateUserSuccess)
  onUpdateUserSuccess({ dispatch }: StateContext<RegistrationStateModel>): void {
    dispatch([
      new MarkFormDirty(false),
      new GetUserPersonalInfo(),
      new ShowMessageBar({
        message: SnackbarText.updateUser,
        type: 'success'
      })
    ]);
    this.location.back();
  }
}
