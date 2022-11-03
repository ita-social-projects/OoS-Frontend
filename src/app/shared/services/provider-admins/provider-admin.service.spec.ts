import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ProviderAdminService } from './provider-admin.service';

describe('ProviderAdminService', () => {
  let service: ProviderAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(ProviderAdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
