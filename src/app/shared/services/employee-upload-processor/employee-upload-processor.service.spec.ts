import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EmployeeUploadProcessorService } from './employee-upload-processor.service';

describe('EmployeeUploadProcessorService', () => {
  let service: EmployeeUploadProcessorService<any>;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EmployeeUploadProcessorService]
    });
    service = TestBed.inject(EmployeeUploadProcessorService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call HttpClient.put with wrapped employees data', () => {
    const mockResponse = 'Upload successful';
    const mockItems = [{ name: 'Employee1' }];
    const mockId = '123';

    service.uploadEmployeesList(mockItems, mockId).subscribe((response) => {
      expect(response.body).toBe(mockResponse);
      expect(response.status).toBe(200);
    });

    const req = httpTestingController.expectOne('/api/v1/Provider/Upload/123/employees/upload');

    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ employees: mockItems });
    expect(req.request.responseType).toBe('text');
    req.flush(mockResponse, { status: 200, statusText: 'OK' });
    httpTestingController.verify();
  });

  it('should handle error response from HttpClient', () => {
    const mockItems = [{ name: 'Employee1' }];
    const mockId = '123';

    service.uploadEmployeesList(mockItems, mockId).subscribe(
      () => {},
      (error) => {
        expect(error.status).toBe(500);
      }
    );

    const req = httpTestingController.expectOne('/api/v1/Provider/Upload/123/employees/upload');
    req.flush('Error uploading employees', { status: 500, statusText: 'Internal Server Error' });
    httpTestingController.verify();
  });
});
