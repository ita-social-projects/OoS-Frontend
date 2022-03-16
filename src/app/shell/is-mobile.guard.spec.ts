import { TestBed } from '@angular/core/testing';

import { IsMobileGuard } from './is-mobile.guard';

describe('IsMobileGuard', () => {
  let guard: IsMobileGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(IsMobileGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
