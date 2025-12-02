import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, switchMap } from 'rxjs/operators';

import { OnAuthFail } from 'shared/store/registration.actions';
import { environment } from 'src/environments/environment';
import { ERROR_HANDLED } from './error-handle.interceptor';

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {
  constructor(
    public store: Store,
    private oidcSecurityService: OidcSecurityService
  ) {}

  public intercept(request: HttpRequest<HttpInterceptor>, next: HttpHandler): Observable<HttpEvent<HttpInterceptor>> {
    const url: string = environment.serverUrl + request.url;

    if (request.url.indexOf('http://') !== -1 || request.url.indexOf('https://') !== -1 || request.url.endsWith('.json')) {
      return next.handle(request).pipe(
        retry(1),
        catchError((error: HttpErrorResponse) => {
          if (request.context.get(ERROR_HANDLED)) {
            return;
          }
          this.store.dispatch(new OnAuthFail());
          return throwError(() => error);
        })
      );
    }
    return this.oidcSecurityService.getAccessToken().pipe(
      switchMap((token: string) => {
        const tokenTitle = token ? `Bearer ${token}` : '';

        if (typeof token === 'string') {
          return next
            .handle(
              request.clone({
                url: url,
                setHeaders: { Authorization: tokenTitle }
              })
            )
            .pipe(catchError((error) => throwError(() => error)));
        }

        return next
          .handle(
            request.clone({
              url: url
            })
          )
          .pipe(catchError((error) => throwError(() => error)));
      })
    );
  }
}
