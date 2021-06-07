import { TestBed } from '@angular/core/testing';
import { GeolocationService } from './geolocation.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import Geocoder from 'leaflet-control-geocoder';

describe('GeolocationService', () => {
  let service: GeolocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        Geocoder],
    });
    service = TestBed.inject(GeolocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
