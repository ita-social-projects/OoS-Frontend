import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Select, Store } from '@ngxs/store';
import { UserRegistrationState } from '../store/user-registration.state';

​
@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {
​
constructor(
    public store: Store,
    private oidcSecurityService: OidcSecurityService,
    private http: HttpClient) {}

@Select(UserRegistrationState.role)
role$: Observable<string>;
​
public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
​
    let token = this.oidcSecurityService.getToken();

   let tokenTitle= (token) ? `Bearer ${token}`: null;
    
    if (typeof(token) === 'string') {
      return next.handle(request.clone({
        setHeaders: { Authorization: tokenTitle }
      }))
        .pipe(catchError((error) => {
        return throwError(error);
      }));
    }
    return next.handle(request).pipe(catchError((error) => {
      return throwError(error);
    }));
  }
}