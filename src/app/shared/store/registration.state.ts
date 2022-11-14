import { MinistryAdmin } from './../models/ministryAdmin.model';
import { PersonalInfoRole } from './../enum/role';
import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import {
  Login,
  Logout,
  CheckAuth,
  OnAuthFail,
  CheckRegistration,
  GetProfile,
  OnUpdateUserSuccess,
  UpdateUser,
  OnUpdateUserFail,
  GetUserPersonalInfo
} from './registration.actions';
import { LoginResponse, OidcSecurityService } from 'angular-auth-oidc-client';
import jwt_decode from 'jwt-decode';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../models/user.model';
import { ProviderService } from '../services/provider/provider.service';
import { ParentService } from '../services/parent/parent.service';
import { Parent } from '../models/parent.model';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Role } from '../enum/role';
import { UserService } from '../services/user/user.service';
import { Observable, of, throwError } from 'rxjs';
import { TechAdminService } from '../services/tech-admin/tech-admin.service';
import { SignalRService } from '../services/signalR/signal-r.service';
import { MarkFormDirty, ShowMessageBar } from './app.actions';
import { HttpErrorResponse } from '@angular/common/http';
import { TechAdmin } from '../models/techAdmin.model';
import { Provider } from '../models/provider.model';
import { SnackbarText } from '../enum/messageBar';
import { MinistryAdminService } from '../services/ministry-admin/ministry-admin.service';
import { NOTIFICATION_HUB_URL } from '../constants/hubs-Url';
import { GetAmountOfNewUsersNotifications } from './notifications.actions';

export interface RegistrationStateModel {
  isAuthorized: boolean;
  isLoading: boolean;
  isAutorizationLoading: boolean;
  user: User;
  provider: Provider;
  parent: Parent;
  techAdmin: TechAdmin;
  ministryAdmin: MinistryAdmin;
  role: Role;
  subrole: Role;
}

@State<RegistrationStateModel>({
  name: 'registration',
  defaults: {
    isAuthorized: false,
    isAutorizationLoading: true,
    isLoading: false,
    user: undefined,
    provider: undefined,
    parent: undefined,
    techAdmin: undefined,
    ministryAdmin: undefined,
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
  static isAutorizationLoading(state: RegistrationStateModel): boolean {
    return state.isAutorizationLoading;
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
    private router: Router,
    private signalRservice: SignalRService,
    private ministryAdminService: MinistryAdminService
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
  Logout({}: StateContext<RegistrationStateModel>): void {
    this.oidcSecurityService.logoff();
  }

  @Action(CheckAuth)
  CheckAuth({ patchState, dispatch }: StateContext<RegistrationStateModel>): void {
    this.oidcSecurityService.checkAuth().subscribe((auth: LoginResponse) => {
      patchState({ isAuthorized: auth.isAuthenticated });
      if (auth.isAuthenticated) {
        this.oidcSecurityService.getAccessToken().subscribe((value: string) => {
          const token = jwt_decode(value);
          const subrole = token['subrole'];
          const role = token['role'];
          patchState({ subrole, role });
          dispatch(new GetUserPersonalInfo(PersonalInfoRole[role])).subscribe(() => dispatch(new CheckRegistration()));
        });
      } else {
        patchState({ role: Role.unauthorized, isAutorizationLoading: false });
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
    const hubConnection = this.signalRservice.startConnection(NOTIFICATION_HUB_URL);

    hubConnection.on('ReceiveNotification', () => dispatch(new GetAmountOfNewUsersNotifications()));

    if (state.user.isRegistered) {
      dispatch(new GetProfile());
      patchState({ isAutorizationLoading: false });
    } else {
      this.router.navigate(['/create-provider', '']).finally(() => patchState({ isAutorizationLoading: false }));
    }
  }

  @Action(GetProfile)
  getProfile({ patchState, getState }: StateContext<RegistrationStateModel>, {}: GetProfile): Observable<Parent> | Observable<Provider> {
    const state = getState();
    patchState({ role: state.user.role as Role });

    switch (state.user.role) {
      case Role.parent:
        return this.parentService.getProfile().pipe(tap((parent: Parent) => patchState({ parent: parent })));
      case Role.techAdmin:
        return this.techAdminService.getProfile().pipe(tap((techAdmin: TechAdmin) => patchState({ techAdmin: techAdmin })));
      case Role.ministryAdmin:
        return this.ministryAdminService
          .getMinistryAdminProfile()
          .pipe(tap((ministryAdmin: MinistryAdmin) => patchState({ ministryAdmin: ministryAdmin })));
      default:
        return this.providerService.getProfile().pipe(tap((provider: Provider) => patchState({ provider: provider })));
    }
  }

  @Action(GetUserPersonalInfo)
  getUserPersonalInfo({ patchState }: StateContext<RegistrationStateModel>, { userRole }: GetUserPersonalInfo): Observable<User> {
    patchState({ isLoading: true });
    return this.userService.getPersonalInfo(userRole).pipe(tap((user: User) => patchState({ user: user, isLoading: false })));
  }

  @Action(UpdateUser)
  updateUser({ dispatch }: StateContext<RegistrationStateModel>, { userRole, user }: UpdateUser): Observable<User | Observable<void>> {
    return this.userService.updatePersonalInfo(userRole, user).pipe(
      tap(() => dispatch(new OnUpdateUserSuccess(userRole))),
      catchError((error: HttpErrorResponse) => of(dispatch(new OnUpdateUserFail(error))))
    );
  }

  @Action(OnUpdateUserFail)
  onUpdateUserFail({ dispatch }: StateContext<RegistrationStateModel>, { payload }: OnUpdateUserFail): void {
    throwError(payload);
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }

  @Action(OnUpdateUserSuccess)
  onUpdateUserSuccess({ dispatch }: StateContext<RegistrationStateModel>, { payload }: OnUpdateUserSuccess): void {
    dispatch([
      new MarkFormDirty(false),
      new GetUserPersonalInfo(payload),
      new ShowMessageBar({
        message: SnackbarText.updateUser,
        type: 'success'
      })
    ]);
    this.router.navigate(['/personal-cabinet/config']);
  }
}
