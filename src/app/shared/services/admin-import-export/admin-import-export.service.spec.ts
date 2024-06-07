import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpHeaders } from '@angular/common/http';
import { IEmailsEdrpousResponse } from 'shared/models/admin-import-export.model';
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

  it('should return providers', () => {
    const mockResponse = 'mock response';
    service.getAllProviders().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });
    const mockHeaders = new HttpHeaders({
      Accept: 'text/html',
      'Content-Type': 'text/plain; charset=utf-8'
    });
    const req = httpMock.expectOne(`${service.baseApiUrl}/admin/providers/export`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Accept')).toBe('text/html');
    expect(req.request.headers.get('Content-Type')).toBe('text/plain; charset=utf-8');
    req.flush(mockResponse);
  });
  it('should send data to server', () => {
    const providersData = {
      edrpous: {
        1: 12345678,
        2: 12345678
      },
      emails: {
        1: 'sleep@gmail.com',
        2: 'some@gmail.com'
      }
    };
    const mockResponse: IEmailsEdrpousResponse = {
      edrpous: [],
      emails: []
    };
    service.sendEmailsEDRPOUsForVerification(providersData).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });
    const req = httpMock.expectOne(`${service.baseApiUrl}/providers/import/validate`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(providersData);
    req.flush(mockResponse);
  });
});
