import { HttpClient, HttpHandler } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { CityFilterService } from './city-filter.service';

describe('CityFilterService', () => {
  let service: CityFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpClient, HttpHandler]
    });
    service = TestBed.inject(CityFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
