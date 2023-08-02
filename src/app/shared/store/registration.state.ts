import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { LoginResponse, OidcSecurityService } from 'angular-auth-oidc-client';
import jwt_decode from 'jwt-decode';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { TerritorialCommunityAdmin } from 'shared/models/territorialCommunityAdmin.model';
import { TerritorialCommunityAdminService } from 'shared/services/territorial-community-admin/territorial-community-admin.service';
import { ModeConstants } from '../constants/constants';
import { SnackbarText } from '../enum/enumUA/messageBer';
import { Role } from '../enum/role';
import { Parent } from '../models/parent.model';
import { Provider } from '../models/provider.model';
import { RegionAdmin } from '../models/regionAdmin.model';
import { TechAdmin } from '../models/techAdmin.model';
import { User } from '../models/user.model';
import { MinistryAdminService } from '../services/ministry-admin/ministry-admin.service';
import { ParentService } from '../services/parent/parent.service';
import { ProviderService } from '../services/provider/provider.service';
import { RegionAdminService } from '../services/region-admin/region-admin.service';
import { TechAdminService } from '../services/tech-admin/tech-admin.service';
import { UserService } from '../services/user/user.service';
import { MinistryAdmin } from './../models/ministryAdmin.model';
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
  areaAdmin: TerritorialCommunityAdmin;
  role: Role;
  subrole: Role;
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
  static subrole(state: RegistrationStateModel): Role | undefined {
    return state.subrole;
  }

  constructor(
    private oidcSecurityService: OidcSecurityService,
    private snackBar: MatSnackBar,
    private userService: UserService,
    private providerService: ProviderService,
    private parentService: ParentService,
    private techAdminService: TechAdminService,
    private regionAdminService: RegionAdminService,
    private router: Router,
    private ministryAdminService: MinistryAdminService,
    private territorialCommunityAdmin: TerritorialCommunityAdminService,
    private location: Location
  ) {}

  @Action(Login)
  Login({}: StateContext<RegistrationStateModel>, { payload }: Login): void {
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
  logout({}: StateContext<RegistrationStateModel>): void {
    this.oidcSecurityService.logoff();
  }

  @Action(CheckAuth)
  checkAuth({ patchState, dispatch }: StateContext<RegistrationStateModel>): void {
    this.oidcSecurityService.checkAuth().subscribe((auth: LoginResponse) => {
      patchState({ isAuthorized: auth.isAuthenticated });
      if (auth.isAuthenticated) {
        this.oidcSecurityService.getAccessToken().subscribe((value: string) => {
          const token = jwt_decode(value);
          const subrole = token['subrole'];
          const role = token['role'];
          patchState({ subrole, role });
          dispatch(new GetUserPersonalInfo()).subscribe(() => dispatch(new CheckRegistration()));
        });
      } else {
        patchState({ role: Role.unauthorized, isAuthorizationLoading: false });
      }
    });
  }

  @Action(OnAuthFail)
  onAuthFail(): void {
    this.snackBar.open("Упс! Перевірте з'єднання", '', {
      duration: 5000,
      panelClass: ['red-snackbar']
    });
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
  getProfile(
    { patchState, getState }: StateContext<RegistrationStateModel>,
    {}: GetProfile
  ):
    | Observable<Parent>
    | Observable<Provider>
    | Observable<MinistryAdmin>
    | Observable<RegionAdmin>
    | Observable<TerritorialCommunityAdmin> {
    const state = getState();
    patchState({ role: state.user.role as Role });

    switch (state.user.role) {
      case Role.parent:
        return this.parentService.getProfile().pipe(tap((parent: Parent) => patchState({ parent: parent })));
      case Role.techAdmin:
        return this.techAdminService.getProfile().pipe(tap((techAdmin: TechAdmin) => patchState({ techAdmin: techAdmin })));
      case Role.regionAdmin:
        return this.regionAdminService.getAdminProfile().pipe(tap((regionAdmin: RegionAdmin) => patchState({ regionAdmin: regionAdmin })));
      case Role.ministryAdmin:
        return this.ministryAdminService
          .getAdminProfile()
          .pipe(tap((ministryAdmin: MinistryAdmin) => patchState({ ministryAdmin: ministryAdmin })));
      case Role.areaAdmin:
        return this.territorialCommunityAdmin
          .getAdminProfile()
          .pipe(tap((territorialCommunityAdmin: TerritorialCommunityAdmin) => patchState({ areaAdmin: territorialCommunityAdmin })));
      default:
        return this.providerService.getProfile().pipe(tap((provider: Provider) => patchState({ provider: provider })));
    }
  }

  @Action(GetUserPersonalInfo)
  getUserPersonalInfo({ patchState }: StateContext<RegistrationStateModel>, {}: GetUserPersonalInfo): Observable<User> {
    patchState({ isLoading: true });
    return this.userService.getPersonalInfo().pipe(tap((user: User) => patchState({ user: user, isLoading: false })));
  }

  @Action(UpdateUser)
  updateUser({ dispatch }: StateContext<RegistrationStateModel>, { user }: UpdateUser): Observable<User | Observable<void>> {
    return this.userService.updatePersonalInfo(user).pipe(
      tap(() => dispatch(new OnUpdateUserSuccess())),
      catchError((error: HttpErrorResponse) => of(dispatch(new OnUpdateUserFail(error))))
    );
  }

  @Action(OnUpdateUserFail)
  onUpdateUserFail({ dispatch }: StateContext<RegistrationStateModel>, {}: OnUpdateUserFail): void {
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }

  @Action(OnUpdateUserSuccess)
  onUpdateUserSuccess({ dispatch }: StateContext<RegistrationStateModel>, {}: OnUpdateUserSuccess): void {
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
