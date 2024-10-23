import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';

import { ApplicationEntityType, ApplicationShowParams } from 'shared/enum/applications';
import { ApplicationStatuses } from 'shared/enum/statuses';
import { Application, ApplicationFilterParameters, ApplicationUpdate } from 'shared/models/application.model';
import { ApplicationService } from './application.service';

describe('ApplicationService', () => {
  let service: ApplicationService;
  let httpTestingController: HttpTestingController;
  const mockApplication = { id: 'id' } as Application;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgxsModule.forRoot([])]
    });
    service = TestBed.inject(ApplicationService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get applications by property id', (done) => {
    const propertyId = 'id';
    const parameters = {
      property: ApplicationEntityType.provider,
      statuses: [ApplicationStatuses.Approved],
      workshops: ['workshopId'],
      children: ['childrenId'],
      searchString: 'searchString',
      size: 10,
      from: 1,
      show: ApplicationShowParams.All
    } as ApplicationFilterParameters;

    service.getApplicationsByPropertyId(propertyId, parameters).subscribe((response) => {
      expect(response).toBeTruthy();
      expect(response.entities).toEqual([mockApplication]);
      expect(response.totalAmount).toEqual(1);
      done();
    });

    const req = httpTestingController.expectOne((request) => request.url === `/api/v1/${parameters.property}/${propertyId}/applications`);

    req.flush({ entities: [mockApplication], totalAmount: 1 });

    expect(req.request.method).toEqual('GET');
  });

  it('should get pending applications by provider id', (done) => {
    const providerId = 'id';

    service.getPendingApplicationsByProviderId(providerId).subscribe((count) => {
      expect(count).toEqual(5);
      done();
    });

    const req = httpTestingController.expectOne(`/api/v1/provider/${providerId}/applications/pending`);
    req.flush(5);

    expect(req.request.method).toEqual('GET');
  });

  it('should get applications allowed to review', (done) => {
    const parentId = 'parentId';
    const workshopId = 'workshopId';

    service.getApplicationsAllowedToReview(parentId, workshopId).subscribe((allowed) => {
      expect(allowed).toBeTruthy();
      done();
    });

    const req = httpTestingController.expectOne(`/api/v1/applications/reviewable/parents/${parentId}/workshops/${workshopId}`);
    req.flush(true);

    expect(req.request.method).toEqual('GET');
  });

  it('should create application', (done) => {
    service.createApplication(mockApplication).subscribe((response) => {
      expect(response.body).toEqual(mockApplication);
      done();
    });

    const req = httpTestingController.expectOne('/api/v1/applications');
    req.flush(mockApplication, { status: 201, statusText: 'Created' });

    expect(req.request.method).toEqual('POST');
  });

  it('should update application', (done) => {
    const applicationUpdate = { ...mockApplication, status: 'approve' } as ApplicationUpdate;

    service.updateApplication(applicationUpdate).subscribe((application) => {
      expect(application).toEqual(applicationUpdate);
      done();
    });

    const req = httpTestingController.expectOne('/api/v1/applications');
    req.flush(applicationUpdate);

    expect(req.request.method).toEqual('PUT');
  });

  it('should get status if allowed to apply', (done) => {
    const childId = 'childId';
    const workshopId = 'workshopId';

    service.getStatusIsAllowToApply(childId, workshopId).subscribe((allowed) => {
      expect(allowed).toBeTruthy();
      done();
    });

    const req = httpTestingController.expectOne(`/api/v1/applications/allowed/workshops/${workshopId}/children/${childId}`);
    req.flush(true);

    expect(req.request.method).toEqual('GET');
  });
});
