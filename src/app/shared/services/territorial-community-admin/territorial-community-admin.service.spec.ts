import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { TerritorialCommunityAdminService } from './territorial-community-admin.service';

describe('TerritorialCommunityAdminService', () => {
  let service: TerritorialCommunityAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgxsModule.forRoot([])]
    });
    service = TestBed.inject(TerritorialCommunityAdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
