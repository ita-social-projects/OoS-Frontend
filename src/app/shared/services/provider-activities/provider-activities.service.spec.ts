import { TestBed } from '@angular/core/testing';

import { ProviderActivitiesService } from './provider-activities.service';

describe('ProviderActivitiesService', () => {
  let service: ProviderActivitiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProviderActivitiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
