import { TestBed } from '@angular/core/testing';

import { CityFilterService } from './city-filter.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CityFilterService', () => {
  let service: CityFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
    });
    service = TestBed.inject(CityFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
