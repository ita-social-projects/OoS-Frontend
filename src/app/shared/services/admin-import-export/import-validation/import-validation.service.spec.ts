import { TestBed } from '@angular/core/testing';

import { ImportValidationService } from './import-validation.service';

describe('ImportValidationService', () => {
  let service: ImportValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImportValidationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
