import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Select, Store } from '@ngxs/store';
import { RegistrationState } from '../store/registration.state';
import { environment } from 'src/environments/environment';


@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {

  constructor(
    public store: Store,
    private oidcSecurityService: OidcSecurityService) { }

  @Select(RegistrationState.role)
  role$: Observable<string>;

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (request.url.indexOf('http://') !== -1 || request.url.indexOf('http://') !== -1) {

      return next.handle(request).pipe(catchError((error) => {
        return throwError(error);
      }));
    }
    const token = this.oidcSecurityService.getToken();

    const tokenTitle = (token) ? `Bearer ${token}` : null;

    if (typeof (token) === 'string') {
      return next.handle(request.clone({
        url: environment.serverUrl + request.url,
        setHeaders: { Authorization: tokenTitle }
      }))
        .pipe(catchError((error) => {
          return throwError(error);
        }));
    }
    return next.handle(request.clone({
      url: environment.serverUrl + request.url
    }))
      .pipe(catchError((error) => {
        return throwError(error);
      }));
  }
}
