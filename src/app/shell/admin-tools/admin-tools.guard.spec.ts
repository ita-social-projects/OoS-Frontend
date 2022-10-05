import { TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';

import { AdminToolsGuard } from './admin-tools.guard';

describe('AdminToolsGuard', () => {
  let guard: AdminToolsGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([])],
    });
    guard = TestBed.inject(AdminToolsGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
