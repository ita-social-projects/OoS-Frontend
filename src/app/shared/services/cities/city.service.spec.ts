import { TestBed } from '@angular/core/testing';

import { CityService } from './city.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CityFilterService', () => {
  let service: CityService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(CityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
