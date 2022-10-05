import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Select } from '@ngxs/store';
import { filter, map } from 'rxjs/operators';
import { Role } from '../../shared/enum/role';
import { RegistrationState } from '../../shared/store/registration.state';

@Injectable({
  providedIn: 'root'
})
export class PersonalCabinetGuard implements CanLoad, CanActivate {
  constructor() { }

  @Select(RegistrationState.role)
  role$: Observable<string>;

  canLoad(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.role$.pipe(filter((role: string) => role !== Role.unauthorized), map((role: string) => (role !== Role.unauthorized)));
  }

  canActivate(): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.role$.pipe(filter((role: string) => role !== Role.unauthorized), map((role: string) => (role !== Role.unauthorized)));
  }
}
