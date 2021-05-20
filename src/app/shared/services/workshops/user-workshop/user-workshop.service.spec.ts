import { TestBed } from '@angular/core/testing';

import { UserWorkshopService } from './user-workshop.service';

describe('WorkshopServiceService', () => {
  let service: UserWorkshopService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserWorkshopService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
