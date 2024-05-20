import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { User } from 'shared/models/user.model';
import { Role } from 'shared/enum/role';
import { Select } from '@ngxs/store';
import { RegistrationState } from 'shared/store/registration.state';

@Injectable({
  providedIn: 'root'
})
export class CreateParentGuard {
  @Select(RegistrationState.user)
  private user$: Observable<User>;
  public canLoad(): Observable<boolean> | boolean {
    return this.user$.pipe(
      filter((user: User) => !!user),
      map((user: User) => user.role === Role.parent && user.isRegistered === false)
    );
  }
}
