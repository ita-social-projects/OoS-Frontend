import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';

import { ProviderAdminService } from './provider-admin.service';

describe('ProviderAdminService', () => {
  let service: ProviderAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgxsModule.forRoot([])]
    });
    service = TestBed.inject(ProviderAdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
