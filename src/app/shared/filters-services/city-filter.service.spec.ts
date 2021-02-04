import { TestBed } from '@angular/core/testing';

import { CityFilterService } from './city-filter.service';

describe('CityFilterService', () => {
  let service: CityFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CityFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
