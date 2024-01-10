import { Injectable } from '@angular/core';
import { CanDeactivate, CanLoad, UrlTree } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { Role } from 'shared/enum/role';
import { User } from 'shared/models/user.model';
import { ActivateEditMode } from 'shared/store/app.actions';
import { AppState } from 'shared/store/app.state';
import { RegistrationState } from 'shared/store/registration.state';

@Injectable({
  providedIn: 'root'
})
export class CreateProviderGuard implements CanLoad, CanDeactivate<unknown> {
  @Select(RegistrationState.user)
  user$: Observable<User>;
  @Select(RegistrationState.role)
  role$: Observable<string>;

  constructor(public store: Store) {}

  canLoad(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const isEditMode = this.store.selectSnapshot(AppState.isEditMode);

    return (
      isEditMode ||
      this.user$.pipe(
        filter((user: User) => !!user),
        map((user: User) => user.role === Role.provider && user.isRegistered === false)
      )
    );
  }

  canDeactivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const isEditMode = this.store.selectSnapshot(AppState.isEditMode);

    if (isEditMode) {
      this.store.dispatch(new ActivateEditMode(false));
      return true;
    } else {
      return this.role$.pipe(
        filter(Boolean),
        map((role: string) => role === Role.provider)
      );
    }
  }
}
