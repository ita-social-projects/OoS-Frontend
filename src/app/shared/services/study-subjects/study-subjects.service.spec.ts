import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NgxsModule } from '@ngxs/store';
import { SearchResponse } from 'shared/models/search.model';
import { SubjectModel, SubjectParameters } from 'shared/models/study-subject.model';
import { StudySubjectService } from './study-subjects.service';

describe('StudySubjectService', () => {
  let service: StudySubjectService;
  let httpTestingController: HttpTestingController;

  const mockBaseUrl = '/api/v1/providers';
  const mockProviderId = '123';

  const mockSubject: SubjectModel = {
    id: '1',
    nameInUkrainian: 'Математика',
    nameInInstructionLanguage: 'Mathematics',
    isLanguageUkrainian: true,
    languageId: 2,
    language: { id: 2, code: 'uk', name: 'Ukrainian' },
    activeFrom: '2024-01-01',
    activeTo: '2024-12-31',
    workshopId: '456',
    providerId: mockProviderId
  };

  const mockSubjectList: SearchResponse<SubjectModel[]> = {
    entities: [mockSubject],
    totalAmount: 1
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgxsModule.forRoot([])],
      providers: [StudySubjectService]
    });

    service = TestBed.inject(StudySubjectService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send a POST request to create a study subject', () => {
    service.createStudySubject(mockSubject).subscribe((response) => {
      expect(response).toEqual(mockSubject);
    });

    const req = httpTestingController.expectOne(`${mockBaseUrl}/${mockProviderId}/studysubjects/Create`);

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockSubject);
    req.flush(mockSubject);
  });

  it('should send a GET request to retrieve study subjects', () => {
    const mockParameters: SubjectParameters = {
      providerId: mockProviderId,
      searchString: 'Math',
      from: 0,
      size: 10
    };

    service.getStudySubjects(mockParameters).subscribe((response) => {
      expect(response).toEqual(mockSubjectList);
    });

    const req = httpTestingController.expectOne(`${mockBaseUrl}/${mockProviderId}/studysubjects/Get?SearchString=Math&From=0&Size=10`);

    expect(req.request.method).toBe('GET');
    req.flush(mockSubjectList);
  });

  it('should send a GET request to retrieve a study subject by ID', () => {
    service.getStudySubjectById('1', mockProviderId).subscribe((response) => {
      expect(response).toEqual(mockSubject);
    });

    const req = httpTestingController.expectOne(`${mockBaseUrl}/${mockProviderId}/studysubjects/GetById/1`);

    expect(req.request.method).toBe('GET');
    req.flush(mockSubject);
  });

  it('should throw an error if providerId is missing when getting a study subject by ID', (done) => {
    service.getStudySubjectById('1', '').subscribe({
      error: (error) => {
        expect(error.message).toBe('Provider ID is not available');
        done();
      }
    });

    httpTestingController.expectNone('/');
  });

  it('should send a DELETE request to remove a study subject', () => {
    const mockParameters: SubjectParameters = {
      providerId: mockProviderId,
      from: 0,
      size: 10
    };
    const subjectId = '1';

    service.deleteStudySubject(mockParameters, subjectId).subscribe((response) => {
      expect(response).toBeUndefined();
    });

    const req = httpTestingController.expectOne(`${mockBaseUrl}/${mockProviderId}/studysubjects/Delete/${subjectId}`);

    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should send a PUT request to update a study subject', () => {
    const updatedSubject: SubjectModel = { ...mockSubject, nameInUkrainian: 'Алгебра' };

    service.updateStudySubject(updatedSubject).subscribe((response) => {
      expect(response).toEqual(updatedSubject);
    });

    const req = httpTestingController.expectOne(`${mockBaseUrl}/${mockProviderId}/studysubjects/Update`);

    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedSubject);
    req.flush(updatedSubject);
  });

  it('should handle HTTP errors gracefully', (done) => {
    service.getStudySubjects({ providerId: mockProviderId, from: 0, size: 10 }).subscribe({
      error: (error) => {
        expect(error.status).toBe(500);
        done();
      }
    });

    const req = httpTestingController.expectOne(`${mockBaseUrl}/${mockProviderId}/studysubjects/Get?SearchString=&From=0&Size=10`);

    req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
  });
});
