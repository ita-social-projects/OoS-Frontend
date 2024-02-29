import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';

import { AdminRoles } from 'shared/enum/admins';
import { BaseAdminParameters } from 'shared/models/admin.model';
import { MinistryAdmin } from 'shared/models/ministry-admin.model';
import { MinistryAdminService } from './ministry-admin.service';

describe('MinistryAdminService', () => {
  const baseApiUrl = `/api/v1/${AdminRoles.ministryAdmin}`;
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
    });
    service = TestBed.inject(MinistryAdminService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get admin profile', (done) => {
    service.getAdminProfile().subscribe((profile) => {
      expect(profile).toEqual(mockMinistryAdmin);
      done();
    });

    const req = httpTestingController.expectOne(`${baseApiUrl}/Profile`);
    req.flush(mockMinistryAdmin);

    expect(req.request.method).toEqual('GET');
  });

  it('should get admin by id', (done) => {
    const adminId = 'id';

    service.getAdminById(adminId).subscribe((ministryAdmin) => {
      expect(ministryAdmin).toEqual(mockMinistryAdmin);
      done();
    });

    const req = httpTestingController.expectOne(`${baseApiUrl}/GetById?id=${adminId}`);
    req.flush(mockMinistryAdmin);

    expect(req.request.method).toEqual('GET');
  });

  it('should get all admin', (done) => {
    const parameters: BaseAdminParameters = { size: 4, from: 0 };

    service.getAllAdmin(parameters).subscribe((ministryAdmins) => {
      expect(ministryAdmins).toEqual({ totalAmount: 1, entities: [mockMinistryAdmin] });
      done();
    });

    const req = httpTestingController.expectOne(`${baseApiUrl}/GetByFilter?Size=${parameters.size}&From=${parameters.from}`);
    req.flush({ totalAmount: 1, entities: [mockMinistryAdmin] });

    expect(req.request.method).toEqual('GET');
  });

  it('should get all admin with search string', (done) => {
    const parameters: BaseAdminParameters = { searchString: 'searchName' };
    const mockMinistryAdmins = [{ ...mockMinistryAdmin }, { ...mockMinistryAdmin }];
    mockMinistryAdmins[1].firstName = parameters.searchString;

    service.getAllAdmin(parameters).subscribe((ministryAdmins) => {
      expect(ministryAdmins).toEqual({ totalAmount: 1, entities: [mockMinistryAdmins[1]] });
      done();
    });

    const req = httpTestingController.expectOne(`${baseApiUrl}/GetByFilter?SearchString=${parameters.searchString}&Size=12&From=0`);
    req.flush({ totalAmount: 1, entities: [mockMinistryAdmins[1]] });

    expect(req.request.method).toEqual('GET');
  });

  it('should create admin', (done) => {
    service.createAdmin(mockMinistryAdmin).subscribe((ministryAdmin) => {
      expect(ministryAdmin).toEqual(mockMinistryAdmin);
      done();
    });

    const req = httpTestingController.expectOne(`${baseApiUrl}/Create`);
    req.flush(mockMinistryAdmin);

    expect(req.request.method).toEqual('POST');
  });

  it('should delete admin', (done) => {
    const adminId = 'id';

    service.deleteAdmin(adminId).subscribe((ministryAdmin) => {
      expect(ministryAdmin).toEqual(mockMinistryAdmin);
      done();
    });

    const req = httpTestingController.expectOne(`${baseApiUrl}/Delete?ministryAdminId=${adminId}`);
    req.flush(mockMinistryAdmin);

    expect(req.request.method).toEqual('DELETE');
  });

  it('should block admin', (done) => {
    const adminid = 'id';
    const isBlocked = true;

    service.blockAdmin(adminid, isBlocked).subscribe(done);

    const req = httpTestingController.expectOne(`${baseApiUrl}/Block?ministryAdminId=${adminid}&isBlocked=${isBlocked}`);
    req.flush(null);

    expect(req.request.method).toEqual('PUT');
  });

  it('should update admin', (done) => {
    service.updateAdmin(mockMinistryAdmin).subscribe((ministryAdmin) => {
      expect(ministryAdmin).toEqual(mockMinistryAdmin);
      done();
    });

    const req = httpTestingController.expectOne(`${baseApiUrl}/Update`);
    req.flush(mockMinistryAdmin);

    expect(req.request.method).toEqual('PUT');
  });

  it('should reinvite admin', (done) => {
    const adminId = 'id';

    service.reinviteAdmin(adminId).subscribe(() => done());

    const req = httpTestingController.expectOne(`${baseApiUrl}/Reinvite/${adminId}`);
    req.flush(mockMinistryAdmin);

    expect(req.request.method).toEqual('PUT');
  });
});
