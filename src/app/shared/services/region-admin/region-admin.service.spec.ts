import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { RegionAdminService } from './region-admin.service';

describe('RegionAdminService', () => {
  let service: RegionAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgxsModule.forRoot([])]
    });
    service = TestBed.inject(RegionAdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
