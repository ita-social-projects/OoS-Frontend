import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AdminTabTypes } from 'shared/enum/admins';
import { CompanyInformation } from 'shared/models/company-information.model';
import { PlatformService } from './platform.service';

describe('PlatformService', () => {
  let service: PlatformService;
  let httpTestingController: HttpTestingController;
  const adminTabType = AdminTabTypes.AboutPortal;
  const mockPlatformInfo: CompanyInformation = {
    id: 'platformInfoId',
    title: 'AboutPortal',
    companyInformationItems: []
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(PlatformService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get platform info', (done) => {
    service.getPlatformInfo(adminTabType).subscribe((platformInfo) => {
      expect(platformInfo).toEqual(mockPlatformInfo);
      done();
    });

    const req = httpTestingController.expectOne(`/api/v1/${adminTabType}/Get`);
    req.flush(mockPlatformInfo);

    expect(req.request.method).toEqual('GET');
  });

  it('should update platform info', (done) => {
    service.updatePlatformInfo(mockPlatformInfo, adminTabType).subscribe((platformInfo) => {
      expect(platformInfo).toEqual(mockPlatformInfo);
      done();
    });

    const req = httpTestingController.expectOne(`/api/v1/${adminTabType}/Update`);
    req.flush(mockPlatformInfo);

    expect(req.request.method).toEqual('PUT');
  });
});
