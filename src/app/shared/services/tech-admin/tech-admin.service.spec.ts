import { TestBed } from '@angular/core/testing';

import { TechAdminService } from './tech-admin.service';

describe('TechAdminService', () => {
  let service: TechAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TechAdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
