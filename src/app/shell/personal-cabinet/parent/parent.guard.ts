import { Injectable } from '@angular/core';
import { CanLoad, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { RegistrationState } from 'src/app/shared/store/registration.state';
import { User } from 'src/app/shared/models/user.model';
import { Role } from 'src/app/shared/enum/role';
import { filter, map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ParentGuard implements CanLoad {
  @Select(RegistrationState.user)
  user$: Observable<User>;

  constructor(public store: Store) { }

  canLoad(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.user$.pipe(filter((user: User) => !!user), map((user: User) => user.role === Role.parent));
  }
}
