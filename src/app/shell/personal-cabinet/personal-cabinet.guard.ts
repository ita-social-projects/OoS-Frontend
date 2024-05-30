import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Select } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';

import { ModeConstants } from 'shared/constants/constants';
import { RegistrationState } from 'shared/store/registration.state';
import { User } from 'shared/models/user.model';
import { Role } from 'shared/enum/role';

@Injectable({
  providedIn: 'root'
})
export class PersonalCabinetGuard {
  @Select(RegistrationState.isRegistered)
  private isRegistered$: Observable<boolean>;
  @Select(RegistrationState.user)
  private user$: Observable<User>;

  constructor(private router: Router) {
  }

  public canLoad(): Observable<boolean | UrlTree> {
    return this.isRegistered$.pipe(
      filter((isRegistered: boolean) => isRegistered !== undefined),
      switchMap((isRegistered: boolean) => {
        if (isRegistered) {
          return of(isRegistered);
        } else {
          return this.user$.pipe(
            filter((user: User) => !!user),
            map((user: User) =>
              this.router.createUrlTree([user.role === Role.parent ? '/create-parent' : '/create-provider', ModeConstants.NEW])
            )
          );
        }
      })
    );
  }
}
