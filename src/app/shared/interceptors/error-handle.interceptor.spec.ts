import { TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { TranslateModule } from '@ngx-translate/core';

import { ErrorHandleInterceptor } from './error-handle.interceptor';

describe('ErrorHandleInterceptor', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([]), TranslateModule.forRoot()],
      providers: [ErrorHandleInterceptor]
    })
  );

  it('should be created', () => {
    const interceptor: ErrorHandleInterceptor = TestBed.inject(ErrorHandleInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
