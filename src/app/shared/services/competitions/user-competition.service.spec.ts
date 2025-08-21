import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Store } from '@ngxs/store';

import { Competition, CompetitionDraftCard, CompetitionProviderViewCard } from 'shared/models/competition.model';
import { FeaturesList } from 'shared/models/features-list.model';
import { SearchResponse } from 'shared/models/search.model';
import { UserCompetitionService } from './user-competition.service';

describe('UserCompetitionService', () => {
  let service: UserCompetitionService;
  let httpMock: HttpTestingController;
  let storeMock: any;

  beforeEach(() => {
    storeMock = {
      selectSnapshot: jest.fn()
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserCompetitionService, { provide: Store, useValue: storeMock }]
    });

    service = TestBed.inject(UserCompetitionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get competition by ID', () => {
    const mockCompetition: Competition = { id: '123' } as Competition;

    service.getCompetitionById('123').subscribe((data) => {
      expect(data).toEqual(mockCompetition);
    });

    const req = httpMock.expectOne('/api/v1/CompetitiveEvent/123');
    expect(req.request.method).toBe('GET');
    req.flush(mockCompetition);
  });

  it('should get provider view competitions', () => {
    const mockResponse: SearchResponse<CompetitionProviderViewCard[]> = {
      entities: [{ id: 'comp1' } as CompetitionProviderViewCard],
      totalAmount: 1
    };

    service.getProviderViewCompetitions({ from: 0, size: 10, providerId: 'provider1' }).subscribe((data) => {
      expect(data).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('/api/v1/provider/provider1/competitiveevents?From=0&Size=10');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should create competition', () => {
    const mockCompetition: Competition = { id: '123' } as Competition;

    service.createCompetition(mockCompetition).subscribe((data) => {
      expect(data).toEqual(mockCompetition);
    });

    const req = httpMock.expectOne('/api/v2/competitions-drafts');
    expect(req.request.method).toBe('POST');
    req.flush(mockCompetition);
  });

  it('should update competition using v1', () => {
    storeMock.selectSnapshot.mockReturnValue({ images: false } as FeaturesList);
    const mockCompetition: Competition = { id: '123' } as Competition;

    service.updateCompetition(mockCompetition).subscribe((data) => {
      expect(data).toEqual(mockCompetition);
    });

    const req = httpMock.expectOne('/api/v1/CompetitiveEvent');
    expect(req.request.method).toBe('PUT');
    req.flush(mockCompetition);
  });

  it('should archive competition by ID', () => {
    service.archiveCompetitionById('123').subscribe((response) => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne('/api/v2/CompetitiveEvent/Delete/123');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should create FormData correctly', () => {
    const mockCompetition: any = {
      contacts: { phone: '123456' },
      imageFiles: [new File([], 'image1.png')],
      coverImage: [new File([], 'cover.png')],
      judges: [{ name: 'Judge1' }]
    };

    const formData = (service as any).createFormData(mockCompetition);

    expect(formData.has('contacts')).toBeTruthy();
    expect(formData.has('imageFiles')).toBeTruthy();
    expect(formData.has('coverImage')).toBeTruthy();
    expect(formData.has('judges')).toBeTruthy();
  });

  describe('drafts', () => {
    it('should get provider view competitions drafts', () => {
      const mockResponse: SearchResponse<CompetitionDraftCard[]> = {
        entities: [{ competitiveEventDraftId: 'draft1' } as CompetitionDraftCard],
        totalAmount: 1
      };

      service.getProviderViewCompetitionDrafts({ from: 0, size: 10, providerId: 'provider1' }).subscribe((data) => {
        expect(data).toEqual(mockResponse);
      });

      const req = httpMock.expectOne('/api/v2/provider/provider1/competitions-drafts?From=0&Size=10');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should update competition draft', () => {
      storeMock.selectSnapshot.mockReturnValue({ images: false } as FeaturesList);
      const mockCompetition: Competition = { id: '123' } as Competition;
      const draftId = '111';

      service.updateDraft(draftId, mockCompetition).subscribe((data) => {
        expect(data).toMatchObject(mockCompetition);
      });

      const req = httpMock.expectOne('/api/v2/competitions-drafts/111');
      expect(req.request.method).toBe('PUT');
      req.flush(mockCompetition);
    });

    it('should delete competition draft by ID', () => {
      service.deleteCompetitionDraft('123').subscribe((response) => {
        expect(response).toBeNull();
      });

      const req = httpMock.expectOne('/api/v2/competitions-drafts/123');
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });
});
