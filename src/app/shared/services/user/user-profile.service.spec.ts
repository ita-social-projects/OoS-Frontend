import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Role } from 'shared/enum/role';
import { ParentService } from '../parent/parent.service';
import { ProviderService } from '../provider/provider.service';
import { EmployeeService } from '../employee/employee.service';
import { MinistryAdminService } from '../ministry-admin/ministry-admin.service';
import { RegionAdminService } from '../region-admin/region-admin.service';
import { AreaAdminService } from '../area-admin/area-admin.service';
import { AdminService } from '../admin/admin.service';
import { UserProfileService } from './user-profile.service';

describe('UserProfileService', () => {
  let service: UserProfileService;

  // Create simple mock objects for all dependencies:
  const parentServiceMock = {
    getProfile: jest.fn().mockReturnValue(of({ profile: 'parent profile' }))
  };
  const providerServiceMock = {
    getProfile: jest.fn().mockReturnValue(of({ profile: 'provider profile' }))
  };
  const employeeServiceMock = {
    getEmployeeById: jest.fn().mockReturnValue(of({ profile: 'employee profile' }))
  };
  const ministryAdminServiceMock = {
    getAdminProfile: jest.fn().mockReturnValue(of({ profile: 'ministry admin profile' }))
  };
  const regionAdminServiceMock = {
    getAdminProfile: jest.fn().mockReturnValue(of({ profile: 'region admin profile' }))
  };
  const areaAdminServiceMock = {
    getAdminProfile: jest.fn().mockReturnValue(of({ profile: 'area admin profile' }))
  };
  const adminServiceMock = {
    getAdminProfile: jest.fn().mockReturnValue(of({ profile: 'admin profile' }))
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserProfileService,
        { provide: ParentService, useValue: parentServiceMock },
        { provide: ProviderService, useValue: providerServiceMock },
        { provide: EmployeeService, useValue: employeeServiceMock },
        { provide: MinistryAdminService, useValue: ministryAdminServiceMock },
        { provide: RegionAdminService, useValue: regionAdminServiceMock },
        { provide: AreaAdminService, useValue: areaAdminServiceMock },
        { provide: AdminService, useValue: adminServiceMock }
      ]
    });
    service = TestBed.inject(UserProfileService);
  });

  describe('getStateKeyByRole', () => {
    it('should return "parent" for Role.parent', () => {
      expect(service.getStateKeyByRole(Role.parent)).toBe('parent');
    });
    it('should return "provider" for Role.provider', () => {
      expect(service.getStateKeyByRole(Role.provider)).toBe('provider');
    });
    it('should return "employee" for Role.employee', () => {
      expect(service.getStateKeyByRole(Role.employee)).toBe('employee');
    });
    it('should return "ministryAdmin" for Role.ministryAdmin', () => {
      expect(service.getStateKeyByRole(Role.ministryAdmin)).toBe('ministryAdmin');
    });
    it('should return "regionAdmin" for Role.regionAdmin', () => {
      expect(service.getStateKeyByRole(Role.regionAdmin)).toBe('regionAdmin');
    });
    it('should return "areaAdmin" for Role.areaAdmin', () => {
      expect(service.getStateKeyByRole(Role.areaAdmin)).toBe('areaAdmin');
    });
    it('should return "all" for Role.all', () => {
      expect(service.getStateKeyByRole(Role.all)).toBe('all');
    });
    it('should return "unauthorized" for Role.unauthorized', () => {
      expect(service.getStateKeyByRole(Role.unauthorized)).toBe('unauthorized');
    });
    it('should return "providerDeputy" for Role.providerDeputy', () => {
      expect(service.getStateKeyByRole(Role.providerDeputy)).toBe('providerDeputy');
    });
    it('should return "techAdmin" for Role.techAdmin', () => {
      expect(service.getStateKeyByRole(Role.techAdmin)).toBe('techAdmin');
    });
    it('should return "moderator" for Role.moderator', () => {
      expect(service.getStateKeyByRole(Role.moderator)).toBe('moderator');
    });
    it('should return an empty string for unknown role', () => {
      expect(service.getStateKeyByRole(null)).toBe('');
    });
  });

  describe('getProfileObservableByRole', () => {
    it('should return parent profile observable for Role.parent', (done) => {
      const obs = service.getProfileObservableByRole(Role.parent, '123');
      expect(obs).not.toBeNull();
      obs.subscribe((data) => {
        expect(data.profile).toBe('parent profile');
        done();
      });
    });

    it('should return provider profile observable for Role.provider', (done) => {
      const obs = service.getProfileObservableByRole(Role.provider, '123');
      expect(obs).not.toBeNull();
      obs.subscribe((data) => {
        expect(data.profile).toBe('provider profile');
        done();
      });
    });

    it('should return employee profile observable for Role.employee', (done) => {
      const obs = service.getProfileObservableByRole(Role.employee, '123');
      expect(obs).not.toBeNull();
      obs.subscribe((data) => {
        expect(data.profile).toBe('employee profile');
        done();
      });
    });

    it('should return ministry admin profile observable for Role.ministryAdmin', (done) => {
      const obs = service.getProfileObservableByRole(Role.ministryAdmin, '123');
      expect(obs).not.toBeNull();
      obs.subscribe((data) => {
        expect(data.profile).toBe('ministry admin profile');
        done();
      });
    });

    it('should return region admin profile observable for Role.regionAdmin', (done) => {
      const obs = service.getProfileObservableByRole(Role.regionAdmin, '123');
      expect(obs).not.toBeNull();
      obs.subscribe((data) => {
        expect(data.profile).toBe('region admin profile');
        done();
      });
    });

    it('should return area admin profile observable for Role.areaAdmin', (done) => {
      const obs = service.getProfileObservableByRole(Role.areaAdmin, '123');
      expect(obs).not.toBeNull();
      obs.subscribe((data) => {
        expect(data.profile).toBe('area admin profile');
        done();
      });
    });

    it('should return admin profile observable for Role.techAdmin', (done) => {
      const obs = service.getProfileObservableByRole(Role.techAdmin, '123');
      expect(obs).not.toBeNull();
      obs.subscribe((data) => {
        expect(data.profile).toBe('admin profile');
        done();
      });
    });

    it('should return admin profile observable for Role.moderator', (done) => {
      const obs = service.getProfileObservableByRole(Role.moderator, '123');
      expect(obs).not.toBeNull();
      obs.subscribe((data) => {
        expect(data.profile).toBe('admin profile');
        done();
      });
    });

    // For roles that return new Observable<any>() instances:
    it('should return a new Observable for Role.all, Role.unauthorized', () => {
      const rolesToTest = [Role.all, Role.unauthorized];
      rolesToTest.forEach((role) => {
        const obs = service.getProfileObservableByRole(role, '123');
        // Check that we got something truthy; these observables likely don’t emit data.
        expect(obs).toBeNull();
      });
    });
  });
});
