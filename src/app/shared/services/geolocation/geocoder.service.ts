import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Coords } from 'shared/models/coords.model';
import { Geocoder } from 'shared/models/geolocation';

@Injectable({
  providedIn: 'root'
})
export class GeocoderService {
  constructor(private http: HttpClient) {}

  /**
   * returns a coordinates from codeficator address.
   *
   * @param address - Geocoder
   * @param callback - Function, which receives 1 argument of type Address
   */
  addressDecode(address: Geocoder, callback: (GeolocationAddress) => void): void {
    this.geocode({
      catottgId: address.catottgId,
      street: address.street,
      buildingNumber: address.buildingNumber
    }).subscribe((result: Geocoder) => callback(result));
  }

  locationDecode(coords: Coords, callback: (GeolocationAddress) => void): void {
    this.geocode({
      lat: coords.lat,
      lon: coords.lng,
      isReverse: true
    }).subscribe((result: Geocoder) => callback(result));
  }

  /**
   * This method get geolocation for map
   */
  private geocode(payload: Geocoder): Observable<Geocoder | null> {
    return this.http.post<Geocoder>('/api/v1/Geocoding', { ...payload }).pipe(map((result: Geocoder) => (result ? result : null)));
  }
}
