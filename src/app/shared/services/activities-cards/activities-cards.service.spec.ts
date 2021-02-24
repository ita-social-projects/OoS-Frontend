import { TestBed } from '@angular/core/testing';

import { ActivitiesCardsService } from './activities-cards.service';

describe('OrgCardsService', () => {
  let service: ActivitiesCardsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActivitiesCardsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
