import { TestBed } from '@angular/core/testing';

import { CreateAdminGuard } from './create-admin.guard';

describe('CreateAdminGuard', () => {
  let guard: CreateAdminGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CreateAdminGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
