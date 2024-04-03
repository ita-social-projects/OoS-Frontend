import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Select } from '@ngxs/store';
import { Observable, filter, map } from 'rxjs';

import { RegistrationState } from 'shared/store/registration.state';
import { isRoleAdmin } from 'shared/utils/admin.utils';

@Injectable({
  providedIn: 'root'
})
export class MessagesGuard implements CanActivate {
  @Select(RegistrationState.role)
  private role$: Observable<string>;

  public canActivate(): Observable<boolean> {
    return this.role$.pipe(
      filter(Boolean),
      map((role) => !isRoleAdmin(role))
    );
  }
}
