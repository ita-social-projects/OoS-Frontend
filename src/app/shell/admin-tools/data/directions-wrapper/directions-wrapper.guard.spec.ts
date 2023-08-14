import { TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';

import { DirectionsWrapperGuard } from './directions-wrapper.guard';

describe('DirectionsWrapperGuard', () => {
  let guard: DirectionsWrapperGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([])]
    });
    guard = TestBed.inject(DirectionsWrapperGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
