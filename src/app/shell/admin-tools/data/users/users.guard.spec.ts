import { TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';

import { UsersGuard } from './users.guard';

describe('UsersGuard', () => {
  let guard: UsersGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([])]
    });
    guard = TestBed.inject(UsersGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
