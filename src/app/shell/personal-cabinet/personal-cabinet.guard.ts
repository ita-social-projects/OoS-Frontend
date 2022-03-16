import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Select } from '@ngxs/store';
import { RegistrationState } from 'src/app/shared/store/registration.state';
import { User } from 'src/app/shared/models/user.model';
import { filter, map } from 'rxjs/operators';
import { Role } from 'src/app/shared/enum/role';

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