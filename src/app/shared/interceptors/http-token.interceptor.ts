import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Store } from '@ngxs/store';
import { OnAuthFail } from '../store/registration.actions';
import { environment } from '../../../environments/environment';
@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {

  constructor(
    public store: Store,
    private oidcSecurityService: OidcSecurityService) { }

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const url: string = environment.serverUrl + request.url;

    if (request.url.indexOf('http://') !== -1 || request.url.indexOf('https://') !== -1 || request.url.endsWith('.json')) {
      return next.handle(request)
        .pipe(
          retry(1),
          catchError((error: HttpErrorResponse) => {
            this.store.dispatch(new OnAuthFail());
            return throwError(error);
          })
        );
    }

    const token = this.oidcSecurityService.getAccessToken();
    const tokenTitle = (token) ? `Bearer ${token}` : '';

    if (typeof (token) === 'string') {
      return next.handle(request.clone({
        url: url,
        setHeaders: { Authorization: tokenTitle }
      }))
        .pipe(
          catchError((error) => {
            return throwError(error);
          })
        );
    }

    return next.handle(request.clone({
      url: url,
    }))
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }
}
