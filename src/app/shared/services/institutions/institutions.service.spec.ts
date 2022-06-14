import { TestBed } from '@angular/core/testing';

import { InstitutionsService } from './institutions.service';

describe('InstitutionsService', () => {
  let service: InstitutionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InstitutionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
