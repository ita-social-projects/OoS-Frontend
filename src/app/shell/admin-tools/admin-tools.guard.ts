import { Injectable } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { RegistrationState } from 'shared/store/registration.state';
import { isRoleAdmin } from 'shared/utils/admin.utils';

@Injectable({
  providedIn: 'root'
})
export class AdminToolsGuard {
  @Select(RegistrationState.role)
  private role$: Observable<string>;

  public canLoad(): Observable<boolean> {
    return this.role$.pipe(filter(Boolean), map(isRoleAdmin));
  }
}
