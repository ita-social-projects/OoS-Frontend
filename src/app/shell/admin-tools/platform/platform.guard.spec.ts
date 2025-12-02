import { TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { of } from 'rxjs';

import { Role } from 'shared/enum/role';
import { PlatformGuard } from './platform.guard';

describe('PlatformGuard', () => {
  let guard: PlatformGuard;
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([])]
    });
    guard = TestBed.inject(PlatformGuard);
    store = TestBed.inject(Store);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should return TRUE if canLoad called with techAdmin role', (done) => {
    jest.spyOn(store, 'select').mockReturnValue(of(Role.techAdmin));

    const canLoad = guard.canLoad();

    canLoad.subscribe((value) => {
      expect(value).toBeTruthy();
      done();
    });
  });

  it('should return FALSE if canLoad called with non-techAdmin role role', (done) => {
    jest.spyOn(store, 'select').mockReturnValue(of(Role.regionAdmin));

    const canLoad = guard.canLoad();

    canLoad.subscribe((value) => {
      expect(value).toBeFalsy();
      done();
    });
  });
});
