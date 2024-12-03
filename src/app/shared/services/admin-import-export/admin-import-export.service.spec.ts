import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EmailsEdrpousResponse } from 'shared/models/admin-import-export.model';
import { AdminImportExportService } from './admin-import-export.service';

describe('AdminImportExportService', () => {
  let service: AdminImportExportService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AdminImportExportService]
    });
    service = TestBed.inject(AdminImportExportService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getAllProviders method should return all providers', () => {
    const mockResponse = 'mock response';
    service.getAllProviders().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });
    const req = httpMock.expectOne(`${service.baseApiUrl}/admin/providers/export`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Accept')).toBe('text/csv');
    expect(req.request.headers.get('Content-Type')).toBe('text/plain; charset=utf-8');
    req.flush(mockResponse);
  });

  it('sendEmailsEDRPOUsForVerification method should send data to server and get response', () => {
    const providersData = {
      edrpous: { 1: 12345678, 2: 12345678 },
      emails: { 1: 'sleep@gmail.com', 2: 'some@gmail.com' }
    };
    const mockResponse: EmailsEdrpousResponse = { edrpous: [], emails: [] };
    service.sendEmailsEDRPOUsForVerification(providersData).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });
    const req = httpMock.expectOne(`${service.baseApiUrl}/providers/import/validate`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(providersData);
    req.flush(mockResponse);
  });
});
