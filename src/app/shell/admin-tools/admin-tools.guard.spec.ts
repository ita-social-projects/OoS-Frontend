import { TestBed } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { of } from 'rxjs';

import { Role } from 'shared/enum/role';
import { AdminToolsGuard } from './admin-tools.guard';

describe('AdminToolsGuard', () => {
  let guard: AdminToolsGuard;
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([])]
    });
    guard = TestBed.inject(AdminToolsGuard);
    store = TestBed.inject(Store);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should return TRUE if canLoad called with admin role', (done) => {
    jest.spyOn(store, 'select').mockReturnValue(of(Role.ministryAdmin));

    const canLoad = guard.canLoad();

    canLoad.subscribe((value) => {
      expect(value).toBeTruthy();
      done();
    });
  });

  it('should return FALSE if canLoad called with non-admin role role', (done) => {
    jest.spyOn(store, 'select').mockReturnValue(of(Role.provider));

    const canLoad = guard.canLoad();

    canLoad.subscribe((value) => {
      expect(value).toBeFalsy();
      done();
    });
  });
});
