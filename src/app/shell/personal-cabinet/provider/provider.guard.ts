import { Injectable } from '@angular/core';
import { UrlTree } from '@angular/router';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { Role } from 'shared/enum/role';
import { RegistrationState } from 'shared/store/registration.state';

@Injectable({
  providedIn: 'root'
})
export class ProviderGuard  {
  @Select(RegistrationState.role)
  role$: Observable<string>;

  canLoad(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.role$.pipe(
      filter(Boolean),
      map((role: string) => role === Role.provider)
    );
  }
}
