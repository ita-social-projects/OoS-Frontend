import { Injectable } from '@angular/core';
import { UrlTree, CanLoad } from '@angular/router';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Role } from '../../shared/enum/role';
import { RegistrationState } from '../../shared/store/registration.state';

@Injectable({
  providedIn: 'root'
})
export class AdminToolsGuard implements CanLoad {
  constructor() {}

  @Select(RegistrationState.role)
  role$: Observable<string>;

  canLoad(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.role$.pipe(
      filter((role: string) => role === Role.techAdmin || role === Role.ministryAdmin),
      map((role: string) => role === Role.techAdmin || role === Role.ministryAdmin)
    );
  }
}
