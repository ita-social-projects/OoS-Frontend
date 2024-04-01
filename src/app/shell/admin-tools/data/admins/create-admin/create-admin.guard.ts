import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { Select } from '@ngxs/store';
import { Observable, filter, map } from 'rxjs';

import { Role } from 'shared/enum/role';
import { RegistrationState } from 'shared/store/registration.state';
import { canManageInstitution, canManageRegion } from 'shared/utils/admin.utils';

@Injectable({
  providedIn: 'root'
})
export class CreateAdminGuard implements CanActivate {
  @Select(RegistrationState.role)
  private role$: Observable<Role>;

  public canActivate(next: ActivatedRouteSnapshot): Observable<boolean> {
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
        return false;
      })
    );
  }
}
