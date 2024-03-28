import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { LoginResponse, OidcSecurityService } from 'angular-auth-oidc-client';
import jwt_decode from 'jwt-decode';
import { Observable, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

import { ModeConstants } from 'shared/constants/constants';
import { SnackbarText } from 'shared/enum/enumUA/message-bar';
import { Role, Subrole } from 'shared/enum/role';
import { AreaAdmin } from 'shared/models/area-admin.model';
import { MinistryAdmin } from 'shared/models/ministry-admin.model';
import { Parent } from 'shared/models/parent.model';
import { Provider } from 'shared/models/provider.model';
import { RegionAdmin } from 'shared/models/region-admin.model';
import { TechAdmin } from 'shared/models/tech-admin.model';
import { TokenPayload } from 'shared/models/token-payload.model';
import { User } from 'shared/models/user.model';
import { AreaAdminService } from 'shared/services/area-admin/area-admin.service';
import { MinistryAdminService } from 'shared/services/ministry-admin/ministry-admin.service';
import { ParentService } from 'shared/services/parent/parent.service';
import { ProviderService } from 'shared/services/provider/provider.service';
import { RegionAdminService } from 'shared/services/region-admin/region-admin.service';
import { UserService } from 'shared/services/user/user.service';
import { MarkFormDirty, ShowMessageBar } from './app.actions';
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

export interface RegistrationStateModel {
  isAuthorized: boolean;
  isLoading: boolean;
  isAuthorizationLoading: boolean;
  user: User;
  provider: Provider;
  parent: Parent;
  techAdmin: TechAdmin;
  ministryAdmin: MinistryAdmin;
  regionAdmin: RegionAdmin;
  areaAdmin: AreaAdmin;
  role: Role;
  subrole: Subrole;
}

@State<RegistrationStateModel>({
  name: 'registration',
  defaults: {
    isAuthorized: false,
    isAuthorizationLoading: true,
    isLoading: false,
    user: undefined,
    provider: undefined,
    parent: undefined,
    techAdmin: undefined,
    regionAdmin: undefined,
    ministryAdmin: undefined,
    areaAdmin: undefined,
    role: Role.unauthorized,
    subrole: null
  }
})
@Injectable()
export class RegistrationState {
  constructor(
    private router: Router,
    private location: Location,
    private oidcSecurityService: OidcSecurityService,
    private userService: UserService,
    private providerService: ProviderService,
    private parentService: ParentService,
    private ministryAdminService: MinistryAdminService,
    private regionAdminService: RegionAdminService,
    private areaAdmin: AreaAdminService
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
  static parent(state: RegistrationStateModel): Parent {
    return state.parent;
  }

  @Selector()
  static role(state: RegistrationStateModel): Role | undefined {
    return state.role;
  }

  @Selector()
  static subrole(state: RegistrationStateModel): Subrole | undefined {
    return state.subrole;
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
  logout(_ctx: StateContext<RegistrationStateModel>): void {
    this.oidcSecurityService.logoff();
  }

  @Action(CheckAuth)
  checkAuth({ patchState, dispatch }: StateContext<RegistrationStateModel>): Observable<void> {
    return this.oidcSecurityService.checkAuth().pipe(
      switchMap((auth: LoginResponse) => {
        patchState({ isAuthorized: auth.isAuthenticated });
        if (auth.isAuthenticated) {
          return this.oidcSecurityService.getAccessToken().pipe(
            switchMap((value: string) => {
              const token: TokenPayload = jwt_decode(value);
              const role = token.role;
              const subrole = token.subrole;
              patchState({ subrole, role });
              return dispatch(new GetUserPersonalInfo()).pipe(switchMap(() => dispatch(new CheckRegistration())));
            })
          );
        } else {
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
      patchState({ isAuthorizationLoading: false });
    } else {
      this.router.navigate(['/create-provider', ModeConstants.NEW]).finally(() => patchState({ isAuthorizationLoading: false }));
    }
  }

  @Action(GetProfile)
  getProfile({
    patchState,
    getState
  }: StateContext<RegistrationStateModel>):
    | Observable<Parent>
    | Observable<Provider>
    | Observable<MinistryAdmin>
    | Observable<RegionAdmin>
    | Observable<AreaAdmin> {
    const state = getState();
    patchState({ role: state.user.role as Role });

    switch (state.user.role) {
      case Role.parent:
        return this.parentService.getProfile().pipe(tap((parent: Parent) => patchState({ parent: parent })));
      case Role.provider:
        return this.providerService.getProfile().pipe(tap((provider: Provider) => patchState({ provider: provider })));
      case Role.ministryAdmin:
        return this.ministryAdminService
          .getAdminProfile()
          .pipe(tap((ministryAdmin: MinistryAdmin) => patchState({ ministryAdmin: ministryAdmin })));
      case Role.regionAdmin:
        return this.regionAdminService.getAdminProfile().pipe(tap((regionAdmin: RegionAdmin) => patchState({ regionAdmin: regionAdmin })));
      case Role.areaAdmin:
        return this.areaAdmin.getAdminProfile().pipe(tap((areaAdmin: AreaAdmin) => patchState({ areaAdmin: areaAdmin })));
    }
  }

  @Action(GetUserPersonalInfo)
  getUserPersonalInfo({ patchState }: StateContext<RegistrationStateModel>): Observable<User> {
    patchState({ isLoading: true });
    return this.userService.getPersonalInfo().pipe(tap((user: User) => patchState({ user: user, isLoading: false })));
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
