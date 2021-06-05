import { TestBed } from '@angular/core/testing';

import { GeolocationService } from './geolocation.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('GeolocationService', () => {
  let service: GeolocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
    });
    service = TestBed.inject(GeolocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
