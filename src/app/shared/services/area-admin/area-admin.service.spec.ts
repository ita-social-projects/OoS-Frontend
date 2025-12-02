import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';

import { AreaAdminService } from './area-admin.service';

describe('AreaAdminService', () => {
  let service: AreaAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgxsModule.forRoot([])]
    });
    service = TestBed.inject(AreaAdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
