import { Injectable } from '@angular/core';
import { CanActivate, UrlTree } from '@angular/router';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { Role, Subrole } from 'shared/enum/role';
import { RegistrationState } from 'shared/store/registration.state';

@Injectable({
  providedIn: 'root'
})
export class NotProviderAdminGuard implements CanActivate {
  @Select(RegistrationState.role)
  public role$: Observable<string>;
  @Select(RegistrationState.subrole)
  public subrole$: Observable<string>;

  public canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return (
      this.role$.pipe(
        filter(Boolean),
        map((role: string) => role === Role.provider)
      ) && this.subrole$.pipe(map((subrole: string) => subrole !== Subrole.ProviderAdmin))
    );
  }
}
