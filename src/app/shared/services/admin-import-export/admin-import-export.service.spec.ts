import { TestBed } from '@angular/core/testing';

import { AdminImportExportService } from './admin-import-export.service';

describe('AdminImportExportService', () => {
  let service: AdminImportExportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminImportExportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
