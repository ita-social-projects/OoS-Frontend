import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { RegistrationState } from '../../../shared/store/registration.state';

@Injectable({
  providedIn: 'root'
})
export class ParentGuard implements CanLoad {
  constructor(public store: Store) { }

  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const role = this.store.selectSnapshot<string>(RegistrationState.role);
    return role === 'parent';
  }
}
