import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { RegistrationState } from 'src/app/shared/store/registration.state';
import { User } from 'src/app/shared/models/user.model';
import { Role } from 'src/app/shared/enum/role';
@Injectable({
  providedIn: 'root'
})
export class ParentGuard implements CanLoad {
  constructor(public store: Store) { }

  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const userRole = this.store.selectSnapshot<User>(RegistrationState.user).role;
    return userRole === Role.parent;
  }
}
