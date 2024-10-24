import { TestBed } from '@angular/core/testing';

import { UserCompetitionService } from './user-competition.service';

describe('UserCompetitionService', () => {
  let service: UserCompetitionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserCompetitionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
