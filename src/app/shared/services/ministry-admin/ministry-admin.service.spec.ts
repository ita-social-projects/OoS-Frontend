import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';

import { AdminRoles } from 'shared/enum/admins';
import { BaseAdminParameters } from 'shared/models/admin.model';
import { MinistryAdmin } from 'shared/models/ministry-admin.model';
import { MinistryAdminService } from './ministry-admin.service';

describe('MinistryAdminService', () => {
  const baseUrl = `/api/v1/${AdminRoles.ministryAdmin}`;
  let service: MinistryAdminService;
  let httpTestingController: HttpTestingController;
  const mockMinistryAdmin: MinistryAdmin = {
    id: 'id',
    email: 'email',
    firstName: 'firstName',
    lastName: 'lastName',
    institutionId: 'institutionId',
    phoneNumber: 'phoneNumber'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgxsModule.forRoot([])]
      // providers: [MinistryAdminService]
    });
    service = TestBed.inject(MinistryAdminService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get admin profile', () => {
    service.getAdminProfile().subscribe((profile) => {
      expect(profile).toEqual(mockMinistryAdmin);
    });

    const req = httpTestingController.expectOne(`${baseUrl}/Profile`);
    req.flush(mockMinistryAdmin);

    expect(req.request.method).toEqual('GET');
  });

  it('should get admin by id', () => {
    const adminId = 'id';

    service.getAdminById(adminId).subscribe((ministryAdmin) => {
      expect(ministryAdmin).toEqual(mockMinistryAdmin);
    });

    const req = httpTestingController.expectOne(`${baseUrl}/GetById?id=${adminId}`);
    req.flush(mockMinistryAdmin);

    expect(req.request.method).toEqual('GET');
  });

  it('should get all admin', () => {
    const parameters: BaseAdminParameters = { size: 4, from: 0 };

    service.getAllAdmin(parameters).subscribe((ministryAdmins) => {
      expect(ministryAdmins).toEqual({ totalAmount: 1, entities: [mockMinistryAdmin] });
    });

    const req = httpTestingController.expectOne(`${baseUrl}/GetByFilter?Size=${parameters.size}&From=${parameters.from}`);
    req.flush({ totalAmount: 1, entities: [mockMinistryAdmin] });

    expect(req.request.method).toEqual('GET');
  });

  it('should create admin', () => {
    service.createAdmin(mockMinistryAdmin).subscribe((ministryAdmin) => {
      expect(ministryAdmin).toEqual(mockMinistryAdmin);
    });

    const req = httpTestingController.expectOne(`${baseUrl}/Create`);
    req.flush(mockMinistryAdmin);

    expect(req.request.method).toEqual('POST');
  });

  it('should delete admin', () => {
    const adminId = 'id';

    service.deleteAdmin(adminId).subscribe((ministryAdmin) => {
      expect(ministryAdmin).toEqual(mockMinistryAdmin);
    });

    const req = httpTestingController.expectOne(`${baseUrl}/Delete?ministryAdminId=${adminId}`);
    req.flush(mockMinistryAdmin);

    expect(req.request.method).toEqual('DELETE');
  });

  it('should block admin', () => {
    const adminid = 'id';
    const isBlocked = true;

    service.blockAdmin(adminid, isBlocked).subscribe();

    const req = httpTestingController.expectOne(`${baseUrl}/Block?ministryAdminId=${adminid}&isBlocked=${isBlocked}`);
    req.flush(null);

    expect(req.request.method).toEqual('PUT');
  });

  it('should update admin', () => {
    service.updateAdmin(mockMinistryAdmin).subscribe((ministryAdmin) => {
      expect(ministryAdmin).toEqual(mockMinistryAdmin);
    });

    const req = httpTestingController.expectOne(`${baseUrl}/Update`);
    req.flush(mockMinistryAdmin);

    expect(req.request.method).toEqual('PUT');
  });

  it('should reinvite admin', () => {
    const adminId = 'id';

    service.reinviteAdmin(adminId).subscribe();

    const req = httpTestingController.expectOne(`${baseUrl}/Reinvite/${adminId}`);
    req.flush(mockMinistryAdmin);

    expect(req.request.method).toEqual('PUT');
  });
});
