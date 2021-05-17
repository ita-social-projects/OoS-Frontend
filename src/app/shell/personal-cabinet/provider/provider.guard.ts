import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { RegistrationState } from 'src/app/shared/store/registration.state';


@Injectable({
  providedIn: 'root'
})
export class ProviderGuard implements CanLoad {
  constructor(public store: Store) {
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const role = this.store.selectSnapshot<string>(RegistrationState.role);
    return role === 'provider';
  }
}
