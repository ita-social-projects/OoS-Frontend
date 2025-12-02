import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, convertToParamMap } from '@angular/router';
import { NgxsModule, Store } from '@ngxs/store';
import { of } from 'rxjs';
import { AdminRoles } from 'shared/enum/admins';

import { Role } from 'shared/enum/role';
import { CreateAdminGuard } from './create-admin.guard';

describe('CreateAdminGuard', () => {
  let guard: CreateAdminGuard;
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([])]
    });
    guard = TestBed.inject(CreateAdminGuard);
    store = TestBed.inject(Store);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should return FALSE if canActivate called with techAdmin role and creating techAdmin', (done) => {
    jest.spyOn(store, 'select').mockReturnValue(of(Role.techAdmin));

    const canActivate = guard.canActivate(mockActivatedRouteSnapshot(Role.techAdmin));

    canActivate.subscribe((value) => {
      expect(value).toBeFalsy();
      done();
    });
  });

  it('should return TRUE if canActivate called with techAdmin role and creating ministryAdmin', (done) => {
    jest.spyOn(store, 'select').mockReturnValue(of(Role.techAdmin));

    const canActivate = guard.canActivate(mockActivatedRouteSnapshot(AdminRoles.ministryAdmin));

    canActivate.subscribe((value) => {
      expect(value).toBeTruthy();
      done();
    });
  });

  it('should return TRUE if canActivate called with ministryAdmin role and creating regionAdmin', (done) => {
    jest.spyOn(store, 'select').mockReturnValue(of(Role.ministryAdmin));

    const canActivate = guard.canActivate(mockActivatedRouteSnapshot(AdminRoles.regionAdmin));

    canActivate.subscribe((value) => {
      expect(value).toBeTruthy();
      done();
    });
  });

  it('should return TRUE if canActivate called with regionAdmin role and creating areaAdmin', (done) => {
    jest.spyOn(store, 'select').mockReturnValue(of(Role.regionAdmin));

    const canActivate = guard.canActivate(mockActivatedRouteSnapshot(AdminRoles.areaAdmin));

    canActivate.subscribe((value) => {
      expect(value).toBeTruthy();
      done();
    });
  });

  it('should return FALSE if canActivate called with areaAdmin role and creating areaAdmin', (done) => {
    jest.spyOn(store, 'select').mockReturnValue(of(Role.areaAdmin));

    const canActivate = guard.canActivate(mockActivatedRouteSnapshot(AdminRoles.areaAdmin));

    canActivate.subscribe((value) => {
      expect(value).toBeFalsy();
      done();
    });
  });
});

function mockActivatedRouteSnapshot(role: AdminRoles | Role): ActivatedRouteSnapshot {
  return { paramMap: convertToParamMap({ param: role }) } as ActivatedRouteSnapshot;
}
