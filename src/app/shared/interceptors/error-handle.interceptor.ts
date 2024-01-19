import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ApiErrorTypes } from 'shared/enum/api-error-types';
import { SnackbarText } from 'shared/enum/enumUA/message-bar';
import { ApiError } from 'shared/models/error-response.model';
import { ShowMessageBar } from 'shared/store/app.actions';

@Injectable()
export class ErrorHandleInterceptor implements HttpInterceptor {
  constructor(private store: Store, private translateService: TranslateService) {}

  public intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if ('apiErrorResponse' in error.error) {
          const message = this.buildApiErrorMessage(error.error.apiErrorResponse.apiErrors);
          this.displayErrorMessageBar(message, true);
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
      })
    );
  }

  private buildApiErrorMessage(apiErrors: ApiError[]): string {
    const errorMap = ApiErrorTypes.toApiErrorMap(apiErrors);

    const errorMessages = [...errorMap]
      .map(([group, errors]) => {
        const translatedGroup = this.translateService.instant(ApiErrorTypes.GroupTitle[group] || ApiErrorTypes.GroupTitle.General);
        const translatedErrors = errors
          .filter(ApiErrorTypes.apiErrorExists)
          .map((apiError) => this.translateService.instant(ApiErrorTypes.toErrorMessage(apiError)));
        const joinedErrors = translatedErrors.join(', ');

        return translatedErrors.length ? `${translatedGroup}: ${joinedErrors}` : null;
      })
      .filter(Boolean);

    return errorMessages.join('.\n') + '.';
  }

  private displayErrorMessageBar(message: string, infinityDuration = false): void {
    this.store.dispatch(new ShowMessageBar({ message, type: 'error', infinityDuration }));
  }
}
