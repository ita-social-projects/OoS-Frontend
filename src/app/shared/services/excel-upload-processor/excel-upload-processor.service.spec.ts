import { TestBed } from '@angular/core/testing';

import { ExcelUploadProcessorService } from './excel-upload-processor.service';

describe('ExcelUploadProcessorService', () => {
  let service: ExcelUploadProcessorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExcelUploadProcessorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
