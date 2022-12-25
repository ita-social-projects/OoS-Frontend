import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Select } from '@ngxs/store';
import { filter, map, Observable } from 'rxjs';
import { AdminRole } from '../../../../../shared/enum/admins';
import { Role } from '../../../../../shared/enum/role';
import { RegistrationState } from '../../../../../shared/store/registration.state';

@Injectable({
  providedIn: 'root'
})
export class CreateAdminGuard implements CanActivate {
  @Select(RegistrationState.role)
  role$: Observable<Role>;

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.role$.pipe(
      filter(Boolean),
      map((role: Role) => route.paramMap.get('param') === AdminRole.ministryAdmin && role === Role.techAdmin)
    );
  }
}
