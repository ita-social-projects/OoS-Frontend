import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { ShowMessageBar } from '../store/app.actions';
import { SnackbarText } from '../enum/messageBar';
import { Store } from '@ngxs/store';

@Injectable()
export class ErrorHandleInterceptor implements HttpInterceptor {
  constructor(private store: Store) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMsg = '';
        switch (error.status) {
          case 401:
            errorMsg = 'Unauthorized';
            this.store.dispatch(
              new ShowMessageBar({
                message: SnackbarText.error401,
                type: 'error'
              })
            );
            break;
          case 404:
            errorMsg = `URL NOT FOUND: ${error.url}`;
            this.store.dispatch(
              new ShowMessageBar({
                message: SnackbarText.error404,
                type: 'error'
              })
            );
            break;
          case 403:
            errorMsg = 'Action is forbidden for this user';
            this.store.dispatch(
              new ShowMessageBar({
                message: SnackbarText.error403,
                type: 'error'
              })
            );
          case 500:
            errorMsg = 'Internal Server Error';
            this.store.dispatch(
              new ShowMessageBar({
                message: SnackbarText.error500,
                type: 'error'
              })
            );
            break;
        }
        return throwError(() => new Error(errorMsg));
      })
    );
  }
}
