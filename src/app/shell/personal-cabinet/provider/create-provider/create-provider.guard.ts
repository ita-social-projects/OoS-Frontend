import { Injectable } from '@angular/core';
import { CanDeactivate, CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Role } from 'src/app/shared/enum/role';
import { User } from 'src/app/shared/models/user.model';
import { Provider } from 'src/app/shared/models/provider.model';
import { RegistrationState } from 'src/app/shared/store/registration.state';

@Injectable({
  providedIn: 'root'
})
export class CreateProviderGuard implements CanDeactivate<unknown>, CanLoad {

  @Select(RegistrationState.user)
  user$: Observable<User>;
  @Select(RegistrationState.provider)
  provider$: Observable<Provider>;

  constructor(public store: Store) { }

  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
    //this.user$.pipe(map((user: User) => user.role === Role.provider && user.isRegistered === false)); TODO: improve guard for editMode
  }

  canDeactivate(
    component: unknown,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const provider = this.store.selectSnapshot<Provider>(RegistrationState.provider)


    return this.provider$.pipe(map((provider: Provider) => provider !== undefined));
  }

}
