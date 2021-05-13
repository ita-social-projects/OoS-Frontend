import { TestBed } from '@angular/core/testing';

import { ParentGuard } from './parent.guard';

describe('ParentGuard', () => {
  let guard: ParentGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ParentGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
