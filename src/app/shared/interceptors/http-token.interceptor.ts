import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/org-cards/auth.service';
import { Observable, throwError } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { UserRegistrationState } from '../store/user-registration.state';

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {
  constructor(
    public auth: AuthService,
    public store: Store) {}

  @Select(UserRegistrationState.role)
  role$: Observable<string>;
    
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let token = this.auth.getToken();
    const role = this.store.selectSnapshot<string>(UserRegistrationState.role);
    const tokenTitle = (role) ?  'token': 'Authorization';
    alert('Http token interceptor works!')
    if (role && token !== null) {
      token = `Bearer ${token}`;
    }
    if (typeof token === 'string') {
      return next.handle(request.clone({
        setHeaders: { [tokenTitle]: token }
      })).pipe(catchError((error) => {
        return throwError(error);
      }));
    }
    return next.handle(request).pipe(catchError((error) => {
      return throwError(error);
    }));
  }
}