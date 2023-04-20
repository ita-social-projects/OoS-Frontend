import { TestBed } from '@angular/core/testing';

import { UserWorkshopService } from './user-workshop.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgxsModule } from '@ngxs/store';

describe('WorkshopServiceService', () => {
  let service: UserWorkshopService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgxsModule.forRoot([])]
    });
    service = TestBed.inject(UserWorkshopService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
