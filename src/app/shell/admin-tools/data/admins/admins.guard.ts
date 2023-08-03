import { Injectable } from '@angular/core';
import { CanLoad, UrlTree } from '@angular/router';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { RegistrationState } from 'shared/store/registration.state';
import { canManageRegion } from '../../admin-tools.guard';

@Injectable({
  providedIn: 'root'
})
export class AdminsGuard implements CanLoad {
  @Select(RegistrationState.role)
  role$: Observable<string>;

  canLoad(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.role$.pipe(filter(Boolean), map(canManageRegion));
  }
}
