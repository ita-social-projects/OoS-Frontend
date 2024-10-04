import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';

import { Provider } from 'shared/models/provider.model';
import { ProviderService } from './provider.service';

describe('ProviderService', () => {
  let service: ProviderService;
  let httpTestingController: HttpTestingController;
  const mockProvider = {
    id: 'id',
    email: 'email',
    shortTitle: 'provider',
    institutionId: 'institutionId',
    phoneNumber: 'phoneNumber'
  } as Provider;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgxsModule.forRoot([])]
    });
    service = TestBed.inject(ProviderService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get provider by id', (done) => {
    const providerId = 'id';

    service.getProviderById(providerId).subscribe((provider) => {
      expect(provider).toBeTruthy();
      done();
    });

    const req = httpTestingController.expectOne(`/api/v1/Provider/GetById/${providerId}`);
    req.flush(mockProvider);

    expect(req.request.method).toEqual('GET');
  });

  it('should get provider profile', (done) => {
    service.getProfile().subscribe((provider) => {
      expect(provider).toBeTruthy();
      done();
    });

    const req = httpTestingController.expectOne('/api/v1/Provider/GetProfile');
    req.flush(mockProvider);

    expect(req.request.method).toEqual('GET');
  });

  it('should create provider v1', (done) => {
    service.createProvider({} as any, false).subscribe((provider) => {
      expect(provider).toBeTruthy();
      done();
    });

    const req = httpTestingController.expectOne('/api/v1/Provider/Create');
    req.flush(mockProvider);

    expect(req.request.method).toEqual('POST');
  });

  it('should create provider v2', (done) => {
    service.createProvider({} as any, true).subscribe((provider) => {
      expect(provider).toBeTruthy();
      done();
    });

    const req = httpTestingController.expectOne('/api/v2/Provider/Create');
    req.flush(mockProvider);

    expect(req.request.method).toEqual('POST');
  });

  it('should update provider v1', (done) => {
    service.updateProvider({} as any, false).subscribe((provider) => {
      expect(provider).toBeTruthy();
      done();
    });

    const req = httpTestingController.expectOne('/api/v1/Provider/Update');
    req.flush(mockProvider);

    expect(req.request.method).toEqual('PUT');
  });

  it('should update provider v2', (done) => {
    service.updateProvider({} as any, true).subscribe((provider) => {
      expect(provider).toBeTruthy();
      done();
    });

    const req = httpTestingController.expectOne('/api/v2/Provider/Update');
    req.flush(mockProvider);

    expect(req.request.method).toEqual('PUT');
  });

  it('should update provider status', (done) => {
    service.updateProviderStatus({} as any).subscribe((provider) => {
      expect(provider).toBeTruthy();
      done();
    });

    const req = httpTestingController.expectOne('/api/v1/PublicProvider/StatusUpdate');
    req.flush(mockProvider);

    expect(req.request.method).toEqual('PUT');
  });

  it('should update provider license status', (done) => {
    service.updateProviderLicenseStatus({} as any).subscribe((provider) => {
      expect(provider).toBeTruthy();
      done();
    });

    const req = httpTestingController.expectOne('/api/v1/PrivateProvider/LicenseStatusUpdate');
    req.flush(mockProvider);

    expect(req.request.method).toEqual('PUT');
  });

  it('should delete provider by id', (done) => {
    const providerId = 'id';

    service.deleteProviderById(providerId).subscribe(() => {
      done();
    });

    const req = httpTestingController.expectOne(`/api/v1/Provider/Delete/${providerId}`);
    req.flush(mockProvider);

    expect(req.request.method).toEqual('DELETE');
  });

  it('should get provider types', (done) => {
    service.getProviderTypes().subscribe((data) => {
      expect(data).toBeTruthy();
      done();
    });

    const req = httpTestingController.expectOne('/api/v1/ProviderType/Get');
    req.flush(mockProvider);

    expect(req.request.method).toEqual('GET');
  });

  it('should get institution statuses', (done) => {
    service.getInstitutionStatuses().subscribe((data) => {
      expect(data).toBeTruthy();
      done();
    });

    const req = httpTestingController.expectOne('/api/v1/InstitutionStatus/Get');
    req.flush(mockProvider);

    expect(req.request.method).toEqual('GET');
  });
});
