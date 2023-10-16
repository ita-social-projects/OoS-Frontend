import { TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';

import { PlatformGuard } from './platform.guard';

describe('PlatformGuard', () => {
  let guard: PlatformGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([])]
    });
    guard = TestBed.inject(PlatformGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
