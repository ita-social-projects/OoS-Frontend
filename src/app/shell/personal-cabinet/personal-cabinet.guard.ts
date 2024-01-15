import { Injectable } from '@angular/core';
import { CanLoad, Router, UrlTree } from '@angular/router';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ModeConstants } from 'shared/constants/constants';
import { RegistrationState } from 'shared/store/registration.state';

@Injectable({
  providedIn: 'root'
})
export class PersonalCabinetGuard implements CanLoad {
  @Select(RegistrationState.isRegistered)
  isRegistered$: Observable<boolean>;

  constructor(private router: Router) {}

  canLoad(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.isRegistered$.pipe(
      map((isRegistered: boolean) => isRegistered || this.router.createUrlTree(['/create-provider', ModeConstants.NEW]))
    );
  }
}
