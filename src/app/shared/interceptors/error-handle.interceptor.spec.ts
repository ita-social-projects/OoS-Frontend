import { TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';

import { ErrorHandleInterceptor } from './error-handle.interceptor';

describe('ErrorHandleInterceptor', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([])],
      providers: [ErrorHandleInterceptor]
    })
  );

  it('should be created', () => {
    const interceptor: ErrorHandleInterceptor = TestBed.inject(
      ErrorHandleInterceptor
    );
    expect(interceptor).toBeTruthy();
  });
});
