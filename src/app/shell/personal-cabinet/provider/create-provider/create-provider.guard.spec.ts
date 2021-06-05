import { TestBed } from '@angular/core/testing';

import { CreateProviderGuard } from './create-provider.guard';

describe('CreateProviderGuard', () => {
  let guard: CreateProviderGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CreateProviderGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
