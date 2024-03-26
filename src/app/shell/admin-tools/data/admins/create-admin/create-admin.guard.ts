import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, UrlTree } from '@angular/router';
import { Select } from '@ngxs/store';
import { filter, map, Observable } from 'rxjs';

import { Role } from 'shared/enum/role';
import { RegistrationState } from 'shared/store/registration.state';
import { canManageInstitution, canManageRegion } from 'shared/utils/admin.utils';

@Injectable({
  providedIn: 'root'
})
export class CreateAdminGuard implements CanActivate {
  @Select(RegistrationState.role)
  role$: Observable<Role>;

  canActivate(next: ActivatedRouteSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const createRole: Role = next.paramMap.get('param') as Role;

    return this.role$.pipe(
      filter(Boolean),
      map((role: Role) => {
        switch (createRole) {
          case Role.ministryAdmin:
            return role === Role.techAdmin;
          case Role.regionAdmin:
            return canManageInstitution(role);
          case Role.areaAdmin:
            return canManageRegion(role);
        }
      })
    );
  }
}
