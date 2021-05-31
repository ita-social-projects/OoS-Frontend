import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Select, Store } from '@ngxs/store';
import { RegistrationState } from '../store/registration.state';
import { environment } from 'src/environments/environment';
import { OnAuthFail } from '../store/registration.actions';
@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {

  constructor(
    public store: Store,
    private oidcSecurityService: OidcSecurityService) { }

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token = this.oidcSecurityService.getToken();
    const tokenTitle = (token) ? `Bearer ${token}` : null;

    if (request.url.indexOf('http://') !== -1 || request.url.indexOf('https://') !== -1) {
      return next.handle(request)
        .pipe(
          retry(1),
          catchError((error: HttpErrorResponse) => {
            this.store.dispatch(new OnAuthFail());
            return throwError(error);
          })
        );
    }

    if (request.url.endsWith('.json')) {
      return next.handle(request.clone({
        url: environment.mockUrl + request.url,
      }))
        .pipe(
          catchError((error) => {
            return throwError(error);
          })
        );
    }

    if (typeof (token) === 'string') {
      return next.handle(request.clone({
        url: environment.serverUrl + request.url,
        setHeaders: { Authorization: tokenTitle }
      }))
        .pipe(
          catchError((error) => {
            return throwError(error);
          })
        );
    }

    return next.handle(request.clone({
      url: environment.serverUrl + request.url,
    }))
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }
}
