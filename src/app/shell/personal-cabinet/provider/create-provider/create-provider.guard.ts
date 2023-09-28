import { Injectable } from '@angular/core';
import { CanDeactivate, CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Role } from 'shared/enum/role';
import { User } from 'shared/models/user.model';
import { RegistrationState } from 'shared/store/registration.state';

@Injectable({
  providedIn: 'root'
})
export class CreateProviderGuard implements CanDeactivate<unknown>, CanLoad {
  @Select(RegistrationState.user)
  user$: Observable<User>;
  @Select(RegistrationState.role)
  role$: Observable<string>;

  constructor(public store: Store) {}

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const isEditMode = JSON.parse(sessionStorage.getItem('editMode'));

    return isEditMode
      ? true
      : this.user$.pipe(
        filter((user: User) => !!user),
        map((user: User) => user.role === Role.provider && user.isRegistered === false)
      );
  }

  canDeactivate(
    component: unknown,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const isEditMode = JSON.parse(sessionStorage.getItem('editMode'));

    if (isEditMode) {
      return true;
    } else {
      return this.role$.pipe(
        filter((role: string) => !!role),
        map((role: string) => role === Role.provider)
      );
    }
  }
}
