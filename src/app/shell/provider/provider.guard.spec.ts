import { TestBed } from '@angular/core/testing';

import { ProviderGuard } from './provider.guard';

describe('ProviderGuard', () => {
  let guard: ProviderGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ProviderGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
