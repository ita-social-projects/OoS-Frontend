import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Select } from '@ngxs/store';
import { UserRegistrationState } from '../store/user-registration.state';

​
@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {
​
constructor(
    private oidcSecurityService: OidcSecurityService,
    private http: HttpClient) {}

@Select(UserRegistrationState.role)
role$: Observable<string>;
​
public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
​
    let token = this.oidcSecurityService.getToken();
    const role = this.oidcSecurityService.getToken()['role'];
    const tokenTitle = (role === this.role$) ? 'Authorization' : 'token';

    if (this.role$ === role && token !== null) {
      token = `Bearer ${token}`;
      console.log('This thing works')
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