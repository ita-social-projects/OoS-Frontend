import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import {
  Login,
  Logout,
  CheckAuth,
  OnAuthFail,
  CheckRegistration,
  GetProfile,
} from './registration.actions';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import jwt_decode from 'jwt-decode';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../models/user.model';
import { ProviderService } from '../services/provider/provider.service';
import { ParentService } from '../services/parent/parent.service';
import { Parent } from '../models/parent.model';
import { TechAdmin } from '../models/techAdmin.model';
import { tap } from 'rxjs/operators';
import { Provider } from '../models/provider.model';
import { Router } from '@angular/router';
import { Role } from '../enum/role';
import { UserService } from '../services/user/user.service';
import { Observable } from 'rxjs';
import { TechAdminService } from '../services/tech-admin/tech-admin.service';
import { SignalRService } from '../services/signalR/signal-r.service';
export interface RegistrationStateModel {
  isAuthorized: boolean;
  isLoading: boolean;
  user: User;
  provider: Provider;
  parent: Parent;
  techAdmin: TechAdmin;
  role: Role;
  subrole: Role;
}

@State<RegistrationStateModel>({
  name: 'registration',
  defaults: {
    isAuthorized: false,
    isLoading: false,
    user: undefined,
    provider: undefined,
    parent: undefined,
    techAdmin: undefined,
    role: Role.unauthorized,
    subrole: null
  },
})
@Injectable()
export class RegistrationState {
  @Selector()
  static isAuthorized(state: RegistrationStateModel): boolean {
    return state.isAuthorized;
  }
  @Selector()
  static isLoading(state: RegistrationStateModel): boolean { 
    return state.isLoading
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
  static techAdmin(state: RegistrationStateModel): TechAdmin {
    return state.techAdmin;
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
    private signalRservice: SignalRService
  ) {}

  @Action(Login)
  Login({}: StateContext<RegistrationStateModel>, { payload }: Login): void {
    this.oidcSecurityService.authorize({
      customParams: {
        culture: localStorage.getItem('ui-culture'),
        'ui-culture': localStorage.getItem('ui-culture'),
        ProviderRegistration: payload,
      },
    });
  }

  @Action(Logout)
  Logout({ dispatch }: StateContext<RegistrationStateModel>): void {
    this.oidcSecurityService.logoff();
    dispatch(new CheckAuth());
  }

  @Action(CheckAuth)
  CheckAuth({
    patchState,
    dispatch,
  }: StateContext<RegistrationStateModel>): void { 
    patchState({ isLoading: true });
    this.oidcSecurityService.checkAuth().subscribe((auth) => {
      console.log('is authenticated', auth);
      patchState({ isAuthorized: auth });
     
   
      if (auth) { 
        console.log(auth)  
        const token = jwt_decode(this.oidcSecurityService.getToken());
        const id = token['sub'];
        const subrole = token['subrole'];
       
        this.userService.getUserById(id).subscribe((user) => {
          patchState({ subrole: subrole });
          patchState({ user: user });
          patchState({ isLoading: false });
          dispatch(new CheckRegistration());
        });
      } else {
        patchState({ isLoading: false });
        patchState({ role: Role.unauthorized });
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
  checkRegistration({
    dispatch,
    getState,
  }: StateContext<RegistrationStateModel>): void {
    const state = getState();
    this.signalRservice.startConnection();

    state.user.isRegistered
      ? dispatch(new GetProfile())
      : this.router.navigate(['/create-provider', '']);
  }

  @Action(GetProfile)
  getProfile(
    { patchState, getState }: StateContext<RegistrationStateModel>,
    {}: GetProfile
  ): Observable<Parent> | Observable<Provider> {
    const state = getState();
    patchState({ role: state.user.role as Role });

    switch (state.user.role) {
      case Role.parent:
        return this.parentService
          .getProfile()
          .pipe(tap((parent: Parent) => patchState({ parent: parent })));
      case Role.techAdmin:
        return this.techAdminService
          .getProfile()
          .pipe(
            tap((techAdmin: TechAdmin) => patchState({ techAdmin: techAdmin }))
          );
      default:
        return this.providerService
          .getProfile()
          .pipe(
            tap((provider: Provider) => patchState({ provider: provider }))
          );
    }
  }
}
