/* eslint-disable dot-notation */
import { SnackbarText } from 'shared/enum/enumUA/message-bar';
import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse, HttpRequest, HttpHandler } from '@angular/common/http';
import { NgxsModule } from '@ngxs/store';
import { TranslateModule } from '@ngx-translate/core';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ErrorHandleInterceptor } from './error-handle.interceptor';

describe('ErrorHandleInterceptor', () => {
  let interceptor: ErrorHandleInterceptor;
  let routerMock: any;
  let nextMock: HttpHandler;

  beforeEach(() => {
    routerMock = { navigate: jest.fn() };

    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([]), TranslateModule.forRoot()],
      providers: [ErrorHandleInterceptor, { provide: Router, useValue: routerMock }]
    });

    interceptor = TestBed.inject(ErrorHandleInterceptor);
    nextMock = { handle: jest.fn() };
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should navigate to /server-error for status >= 501', () => {
    const request = { url: '', method: 'GET', headers: {}, context: {} } as HttpRequest<any>;
    const errorResponse = new HttpErrorResponse({ status: 502 });

    nextMock.handle = jest.fn().mockReturnValue(throwError(() => errorResponse));

    interceptor.intercept(request, nextMock).subscribe({
      error: () => {
        expect(routerMock.navigate).toHaveBeenCalledWith(['/server-error']);
      }
    });
  });

  it('should display error message for apiErrorResponse', () => {
    const request = { url: '', method: 'GET', headers: {}, context: {} } as HttpRequest<any>;
    const errorResponse = new HttpErrorResponse({
      status: 400,
      error: { apiErrorResponse: { apiErrors: [] } }
    });

    nextMock.handle = jest.fn().mockReturnValue(throwError(() => errorResponse));

    const displayErrorMessageBarMock = jest.fn();
    // eslint-disable-next-line @typescript-eslint/dot-notation
    interceptor['displayErrorMessageBar'] = displayErrorMessageBarMock;

    interceptor.intercept(request, nextMock).subscribe({
      error: () => {
        expect(displayErrorMessageBarMock).toHaveBeenCalled();
      }
    });
  });

  it('should display specific error message for status 401', () => {
    const request = { url: '', method: 'GET', headers: {}, context: {} } as HttpRequest<any>;
    const errorResponse = new HttpErrorResponse({ status: 401 });

    nextMock.handle = jest.fn().mockReturnValue(throwError(() => errorResponse));

    const displayErrorMessageBarMock = jest.fn();
    // eslint-disable-next-line @typescript-eslint/dot-notation
    interceptor['displayErrorMessageBar'] = displayErrorMessageBarMock;

    interceptor.intercept(request, nextMock).subscribe({
      error: () => {
        expect(displayErrorMessageBarMock).toHaveBeenCalledWith(SnackbarText.error401);
      }
    });
  });
});
