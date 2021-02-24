import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Select } from '@ngxs/store';
import { UserRegistrationState } from 'src/app/shared/store/user-registration.state';
@Injectable({
  providedIn: 'root'
})



export class ProviderGuard implements CanActivate {

  @Select(UserRegistrationState.role)
  role$: Observable<string>;

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(this.role$){
        return true;
      }else{
        return false;
      }
  }
  
}
