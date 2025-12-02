import { TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { of } from 'rxjs';

import { Role } from 'shared/enum/role';
import { DirectionsWrapperGuard } from './directions-wrapper.guard';

describe('DirectionsWrapperGuard', () => {
  let guard: DirectionsWrapperGuard;
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([])]
    });
    guard = TestBed.inject(DirectionsWrapperGuard);
    store = TestBed.inject(Store);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should return TRUE if canLoad called with ministryAdmin role', (done) => {
    jest.spyOn(store, 'select').mockReturnValue(of(Role.ministryAdmin));

    const canLoad = guard.canLoad();

    canLoad.subscribe((value) => {
      expect(value).toBeTruthy();
      done();
    });
  });

  it('should return FALSE if canLoad called with regionAdmin', (done) => {
    jest.spyOn(store, 'select').mockReturnValue(of(Role.regionAdmin));

    const canLoad = guard.canLoad();

    canLoad.subscribe((value) => {
      expect(value).toBeFalsy();
      done();
    });
  });
});
