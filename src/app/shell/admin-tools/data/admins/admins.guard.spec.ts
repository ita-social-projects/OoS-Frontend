import { TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';

import { AdminsGuard } from './admins.guard';

describe('AdminsGuard', () => {
  let guard: AdminsGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([])]
    });
    guard = TestBed.inject(AdminsGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
