import { TestBed } from '@angular/core/testing';

import { MinistryAdminService } from './ministry-admin.service';

describe('MinistryAdminService', () => {
  let service: MinistryAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MinistryAdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
