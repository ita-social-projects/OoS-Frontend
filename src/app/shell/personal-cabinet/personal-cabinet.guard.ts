import { Injectable } from '@angular/core';
import { CanLoad, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Select } from '@ngxs/store';
import { RegistrationState } from 'src/app/shared/store/registration.state';
import { User } from 'src/app/shared/models/user.model';
import { filter, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PersonalCabinetGuard implements CanLoad {
  constructor() { }

  @Select(RegistrationState.user)
  user$: Observable<User>;

  canLoad(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.user$.pipe(filter((user: User) => !!user), map((user: User) => (user !== undefined)));
  }
}
