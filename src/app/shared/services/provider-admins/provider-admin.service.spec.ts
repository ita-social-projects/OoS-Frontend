import { TestBed } from '@angular/core/testing';

import { ProviderAdminService } from './provider-admin.service';

describe('ProviderAdminService', () => {
  let service: ProviderAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProviderAdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
