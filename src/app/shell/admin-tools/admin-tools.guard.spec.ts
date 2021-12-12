import { TestBed } from '@angular/core/testing';

import { AdminToolsGuard } from './admin-tools.guard';

describe('AdminToolsGuard', () => {
  let guard: AdminToolsGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AdminToolsGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
