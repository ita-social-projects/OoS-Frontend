import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NgxsModule } from '@ngxs/store';
import { UnfinishedWorkshopType } from 'shared/models/workshop.model';
import { FormOfLearning } from 'shared/enum/workshop';
import { EditDraft, Workshop, WorkshopDraft } from 'shared/models/workshop.model';
import { UserWorkshopService } from './user-workshop.service';

describe('UserWorkshopService', () => {
  let service: UserWorkshopService;
  let http: HttpTestingController;

  const mockWorkshop = {
    $type: UnfinishedWorkshopType.WithMainProperties,
    availableSeats: 4294967295,
    competitiveSelection: false,
    competitiveSelectionDescription: null,
    dateTimeRanges: [{ workdays: ['friday'], startTime: '12:22', endTime: '13:33' }],
    email: 'sleep@gmail.com',
    facebook: null,
    formOfLearning: FormOfLearning.Offline,
    instagram: null,
    maxAge: 5,
    minAge: 2,
    phone: '+380686042323',
    providerId: '08da842d-12fc-4865-85c5-ec6e6142abad',
    shortTitle: 'fghjhgf',
    title: 'fkfkkff',
    website: 'https://stackoverflow.com/questions/47933634/angular-2-material-select-open-with-button'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgxsModule.forRoot([])],
      providers: [UserWorkshopService]
    });

    service = TestBed.inject(UserWorkshopService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should save workshop step', (done) => {
    const mockResponse = 'MainRequiredPropertiesDto is stored';

    service.saveWorkshopStep(mockWorkshop).subscribe({
      next: (response) => {
        expect(response).toBe(mockResponse);
        done();
      },
      error: done.fail
    });

    const req = http.expectOne('/api/v1/WorkshopTempSave/Store');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockWorkshop);
    req.flush(mockResponse);
  });

  it('should delete unfinished workshop', (done) => {
    service.deleteUnfinishedWorkshop().subscribe({
      next: () => {
        done();
      },
      error: done.fail
    });

    const req = http.expectOne('/api/v1/WorkshopTempSave/Remove');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should get unfinished workshop', (done) => {
    service.getUnfinishedWorkshop().subscribe({
      next: (workshop) => {
        expect(workshop).toEqual(mockWorkshop);
        done();
      },
      error: done.fail
    });

    const req = http.expectOne('/api/v1/WorkshopTempSave/Restore');
    expect(req.request.method).toBe('GET');
    req.flush(mockWorkshop);
  });

  it('should get time to live of unfinished', (done) => {
    service.getTimeToLiveOfUnfinishedWorkshop().subscribe({
      next: (timeToLive) => {
        expect(timeToLive).toBeTruthy();
        done();
      },
      error: done.fail
    });

    const req = http.expectOne('/api/v1/WorkshopTempSave/GetTimeToLive');
    expect(req.request.method).toBe('GET');
    req.flush('6.04:46:52.0000000');
  });

  it('should create workshop draft', (done) => {
    const createDraftV2Spy = jest.spyOn(service, 'createWorkshopDraftV2');
    service.createWorkshopDraft(mockWorkshop as unknown as Workshop).subscribe({
      next: (res) => {
        expect(res).toBeTruthy();
        done();
      },
      error: done.fail
    });

    const req = http.expectOne((reqIns) => reqIns.method === 'POST' && reqIns.url === '/api/v2/WorkshopDraft/Create');
    expect(createDraftV2Spy).toHaveBeenCalled();
    expect(req.request.method).toBe('POST');
    req.flush({} as WorkshopDraft);
  });

  it('should get provider view draft cardss', (done) => {
    const workshopCardParameters = {
      from: 0,
      size: 10,
      providerId: '08da842d-12fc-4865-85c5-ec6e6142abad'
    };

    const mockResponse = [
      {
        workshopDraftId: '123',
        rejectionMessage: 'test',
        draftStatus: 'draft'
      },
      {
        workshopDraftId: '124',
        rejectionMessage: 'test1',
        draftStatus: 'draft'
      }
    ];

    service.getProviderViewWorkshopDrafts(workshopCardParameters).subscribe({
      next: (res) => {
        expect(res).toBeTruthy();
        done();
      },
      error: done.fail
    });

    const request = http.expectOne(
      (req) =>
        req.method === 'GET' &&
        req.url === `/api/v2/WorkshopDraft/GetByProviderId/provider/${workshopCardParameters.providerId}/drafts` &&
        req.params.get('From') === '0' &&
        req.params.get('Size') === '10'
    );
    expect(request.request.method).toBe('GET');
    request.flush(mockResponse);
  });

  it('should send draft for moderation', (done) => {
    service.sendDraftForModeration('123').subscribe({
      next: (res) => {
        expect(res).toBeFalsy();
        done();
      },
      error: done.fail
    });

    const req = http.expectOne('/api/v2/WorkshopDraft/SendForModeration/123');
    expect(req.request.method).toBe('PUT');
    req.flush(null);
  });

  it('should delete cover image by workshop draft ID and moderator ID', (done) => {
    const draftId = 'draft-id';

    service.deleteCoverImageByWorkshopDraftId(draftId).subscribe({
      next: () => done(),
      error: done.fail
    });

    const req = http.expectOne((r) => r.method === 'DELETE' && r.url === `/api/v2/workshop-drafts/${draftId}/moderator/cover-image`);

    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should delete image by workshop draft ID, image ID, and moderator ID', (done) => {
    const draftId = 'draft-id';
    const imageId = 'some/image id with special&chars';

    service.deleteImageByWorkshopDraftId(draftId, imageId).subscribe({
      next: () => done(),
      error: done.fail
    });

    const expectedUrl = `/api/v2/workshop-drafts/${draftId}/moderator/image/${encodeURIComponent(encodeURIComponent(imageId))}`;
    const req = http.expectOne((r) => r.method === 'DELETE' && r.url === expectedUrl);

    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should update workshop draft by moderator', (done) => {
    const draftId = 'draft-id';
    const moderatorId = 'moderator-id';
    const formData: EditDraft = {
      title: 'Updated Workshop Title',
      shortTitle: 'Updated Short',
      institutionHierarchyId: 'institution-id-001',
      workshopDescriptionItems: [
        {
          sectionName: 'Description Title',
          description: 'Some description here'
        }
      ],
      competitiveSelectionDescription: 'Only best kids allowed',
      preferentialTermsOfParticipation: 'Free for orphans',
      enrollmentProcedureDescription: 'Online form + in-person visit'
    };

    service.editWorkshopDraftByModerator(formData, draftId).subscribe({
      next: () => done(),
      error: done.fail
    });

    const req = http.expectOne((r) => r.method === 'PUT' && r.url === `/api/v2/workshop-drafts/${draftId}/moderator-edit`);

    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(formData);
    req.flush(null);
  });
});
