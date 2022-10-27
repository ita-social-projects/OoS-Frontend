import { TestBed } from '@angular/core/testing';

import { ErrorHandleInterceptor } from './error-handle.interceptor';

describe('ErrorHandleInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      ErrorHandleInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: ErrorHandleInterceptor = TestBed.inject(ErrorHandleInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
