import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { Coords } from 'shared/models/coords.model';
import { Geocoder } from 'shared/models/geolocation';

@Injectable({
  providedIn: 'root'
})
export class GeocoderService {
  private readonly baseApiUrl = '/api/v1/Geocoding';

  constructor(private http: HttpClient) {}

  /**
   * returns a coordinates from codeficator address.
   *
   * @param address - Geocoder
   * @param callback - Function, which receives 1 argument of type Address
   */
  public addressDecode(address: Geocoder): Observable<Geocoder | null> {
    return this.geocode(address);
  }

  public locationDecode(coords: Coords): Observable<Geocoder | null> {
    return this.geocode({
      lat: coords.lat,
      lon: coords.lng,
      isReverse: true
    });
  }

  /**
   * This method get geolocation for map
   */
  private geocode(payload: Geocoder): Observable<Geocoder | null> {
    return this.http.post<Geocoder>(this.baseApiUrl, { ...payload }).pipe(map((result: Geocoder) => result || null));
  }
}
