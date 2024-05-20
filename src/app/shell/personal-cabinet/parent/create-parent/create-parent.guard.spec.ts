import { TestBed } from '@angular/core/testing';

import { CreateParentGuard } from './create-parent.guard';

describe('CreateParentGuard', () => {
  let guard: CreateParentGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CreateParentGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
