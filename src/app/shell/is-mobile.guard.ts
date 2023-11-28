import { Injectable } from '@angular/core';
import { UrlTree, CanLoad, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { AppState } from '../shared/store/app.state';

@Injectable({
  providedIn: 'root'
})
export class IsMobileGuard implements CanLoad, CanActivate {
  @Select(AppState.isMobileScreen)
  isMobileScreen$: Observable<boolean>;

  canLoad(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.isMobileScreen$.pipe(
      filter((isMobileScreen: boolean) => isMobileScreen !== undefined),
      map((isMobileScreen: boolean) => isMobileScreen)
    );
  }

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.isMobileScreen$.pipe(
      filter((isMobileScreen: boolean) => isMobileScreen !== undefined),
      map((isMobileScreen: boolean) => isMobileScreen)
    );
  }
}
