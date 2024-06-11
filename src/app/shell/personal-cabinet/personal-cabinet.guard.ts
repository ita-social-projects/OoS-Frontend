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
  @Select(RegistrationState.user)
  private user$: Observable<User>;

  constructor(private router: Router) {}

  public canLoad(): Observable<boolean | UrlTree> {
    return this.user$.pipe(
      filter((user: User) => !!user),
      map((user: User) => {
        if (user.isRegistered) {
          return user.isRegistered;
        } else {
          return this.router.createUrlTree([user.role === Role.parent ? '/create-parent' : '/create-provider', ModeConstants.NEW]);
        }
      })
    );
  }
}
