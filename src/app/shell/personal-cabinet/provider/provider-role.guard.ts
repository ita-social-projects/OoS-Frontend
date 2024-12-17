import { Injectable } from '@angular/core';
import { Select } from '@ngxs/store';
import { filter, map, Observable } from 'rxjs';

import { RegistrationState } from 'shared/store/registration.state';
import { isRoleProvider } from 'shared/utils/provider.utils';

@Injectable({
  providedIn: 'root'
})
export class ProviderRoleGuard {
  @Select(RegistrationState.role)
  private role$: Observable<string>;

  public canLoad(): Observable<boolean> {
    return this.role$.pipe(filter(Boolean), map(isRoleProvider));
  }
}
