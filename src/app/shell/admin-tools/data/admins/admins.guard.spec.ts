import { TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { of } from 'rxjs';

import { Role } from 'shared/enum/role';
import { AdminsGuard } from './admins.guard';

describe('AdminsGuard', () => {
  let guard: AdminsGuard;
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([])]
    });
    guard = TestBed.inject(AdminsGuard);
    store = TestBed.inject(Store);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should return TRUE if canLoad called with regionAdmin role', (done) => {
    jest.spyOn(store, 'select').mockReturnValue(of(Role.regionAdmin));

    const canLoad = guard.canLoad();

    canLoad.subscribe((value) => {
      expect(value).toBeTruthy();
      done();
    });
  });

  it('should return FALSE if canLoad called with role less then regionAdmin', (done) => {
    jest.spyOn(store, 'select').mockReturnValue(of(Role.areaAdmin));

    const canLoad = guard.canLoad();

    canLoad.subscribe((value) => {
      expect(value).toBeFalsy();
      done();
    });
  });
});
