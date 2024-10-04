import { Injectable } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { Role } from 'shared/enum/role';
import { RegistrationState } from 'shared/store/registration.state';

@Injectable({
  providedIn: 'root'
})
export class ParentGuard {
  @Select(RegistrationState.role)
  private role$: Observable<string>;

  public canLoad(): Observable<boolean> {
    return this.role$.pipe(
      filter((role: string) => role === Role.parent),
      map((role: string) => role === Role.parent)
    );
  }
}
