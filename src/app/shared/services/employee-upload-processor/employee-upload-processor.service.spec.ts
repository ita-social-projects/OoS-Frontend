import { TestBed } from '@angular/core/testing';

import { EmployeeUploadProcessorService } from './employee-upload-processor.service';

describe('EmployeeUploadProcessorService', () => {
  let service: EmployeeUploadProcessorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeUploadProcessorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
