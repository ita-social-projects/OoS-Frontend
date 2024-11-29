import { HttpContextToken, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { ApiErrorTypes } from 'shared/enum/api-error-types';
import { SnackbarText } from 'shared/enum/enumUA/message-bar';
import { ApiError } from 'shared/models/error-response.model';
import { ShowMessageBar } from 'shared/store/app.actions';

export const ERROR_HANDLED = new HttpContextToken<boolean>(() => false);

@Injectable()
export class ErrorHandleInterceptor implements HttpInterceptor {
  constructor(
    private store: Store,
    private translateService: TranslateService,
    private router: Router
  ) {}

  public intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status >= 501) {
          this.router.navigate(['/server-error']);
          request.clone({
            context: request.context.set(ERROR_HANDLED, true)
          });
          return throwError(() => error);
        }
        if (error.error?.apiErrorResponse) {
          const message = this.buildApiErrorMessage(error.error.apiErrorResponse.apiErrors);
          this.displayErrorMessageBar(message, 10000);
        } else {
          switch (error.status) {
            case 401:
              this.displayErrorMessageBar(SnackbarText.error401);
              break;
            case 403:
              this.displayErrorMessageBar(SnackbarText.error403);
              break;
            case 404:
              this.displayErrorMessageBar(SnackbarText.error404);
              break;
            case 500:
              this.displayErrorMessageBar(SnackbarText.error500);
              break;
            default:
              this.displayErrorMessageBar(SnackbarText.error);
          }
        }
        return throwError(() => error);
      }),
      finalize(() => {
        request.clone({
          context: request.context.set(ERROR_HANDLED, false)
        });
      })
    );
  }

  private buildApiErrorMessage(apiErrors: ApiError[]): string {
    const errorMap = ApiErrorTypes.toApiErrorMap(apiErrors);

    const errorMessages = [...errorMap]
      .map(([group, errors]) => {
        const translatedGroup = this.translateService.instant(ApiErrorTypes.GroupTitle[group] || ApiErrorTypes.GroupTitle.General);
        const translatedErrors = errors
          .map((apiError) => this.translateService.instant(ApiErrorTypes.toErrorMessage(apiError)))
          .filter(Boolean);
        const joinedErrors = translatedErrors.join(', ');

        return translatedErrors.length ? `${translatedGroup}: ${joinedErrors}` : null;
      })
      .filter(Boolean);

    return errorMessages.join('.\n') + '.';
  }

  private displayErrorMessageBar(message: string, duration?: number): void {
    this.store.dispatch(new ShowMessageBar({ message, type: 'error', duration }));
  }
}
