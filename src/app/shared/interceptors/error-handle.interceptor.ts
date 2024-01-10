import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { SnackbarText } from 'shared/enum/enumUA/message-bar';
import { ShowMessageBar } from 'shared/store/app.actions';

@Injectable()
export class ErrorHandleInterceptor implements HttpInterceptor {
  constructor(private store: Store) {}

  private displayErrorMessageBar(message: string): void {
    this.store.dispatch(
      new ShowMessageBar({
        message: message,
        type: 'error'
      })
    );
  }
  public intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMsg = '';
        switch (error.status) {
          case 401:
            errorMsg = 'Unauthorized';
            this.displayErrorMessageBar(SnackbarText.error401);
            break;
          case 404:
            errorMsg = `URL NOT FOUND: ${error.url}`;
            this.displayErrorMessageBar(SnackbarText.error404);
            break;
          case 403:
            errorMsg = 'Action is forbidden for this user';
            this.displayErrorMessageBar(SnackbarText.error403);
          case 500:
            errorMsg = 'Internal Server Error';
            this.displayErrorMessageBar(SnackbarText.error500);
            break;
        }
        return throwError(() => error);
      })
    );
  }
}
