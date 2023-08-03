import { Injectable } from '@angular/core';
import { CanLoad, UrlTree } from '@angular/router';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { Role } from 'shared/enum/role';
import { RegistrationState } from 'shared/store/registration.state';

@Injectable({
  providedIn: 'root'
})
export class AdminToolsGuard implements CanLoad {
  @Select(RegistrationState.role)
  role$: Observable<string>;

  canLoad(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.role$.pipe(filter(Boolean), map(isRoleAdmin));
  }
}

export function isRoleAdmin(role: string): boolean {
  return [Role.techAdmin, Role.ministryAdmin, Role.regionAdmin, Role.areaAdmin].includes(role as Role);
}

export function canManageInstitution(role: string): boolean {
  return role === Role.techAdmin || role === Role.ministryAdmin;
}

export function canManageRegion(role: string): boolean {
  return canManageInstitution(role) || role === Role.regionAdmin;
}
