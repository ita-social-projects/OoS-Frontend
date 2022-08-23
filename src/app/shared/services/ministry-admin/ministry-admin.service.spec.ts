import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { MinistryAdminService } from './ministry-admin.service';

describe('MinistryAdminService', () => {
  let service: MinistryAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule,
      NgxsModule.forRoot([]), ],
    });
    service = TestBed.inject(MinistryAdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
