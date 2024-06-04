import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { ModeConstants } from 'shared/constants/constants';
import { RegistrationState } from 'shared/store/registration.state';

@Injectable({
  providedIn: 'root'
})
export class PersonalCabinetGuard {
  @Select(RegistrationState.isRegistered)
  private isRegistered$: Observable<boolean>;

  constructor(private router: Router) {}

  public canLoad(): Observable<boolean | UrlTree> {
    return this.isRegistered$.pipe(
      filter((isRegistered: boolean) => isRegistered !== undefined),
      map((isRegistered: boolean) => isRegistered || this.router.createUrlTree(['/create-provider', ModeConstants.NEW]))
    );
  }
}
