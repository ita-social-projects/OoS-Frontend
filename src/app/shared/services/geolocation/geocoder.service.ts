import { tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Geocoder } from '../../models/geolocation';
import { GeolocationAddress } from '../../models/geolocationAddress.model';
import { Coords } from '../../models/coords.model';
import { GeocoderDTO } from './../../models/geolocation';

@Injectable({
  providedIn: 'root',
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
      buildingNumber: address.buildingNumber,
    }).subscribe((result: Geocoder) => callback(result));
  }

  locationDecode(coords: Coords, callback: (GeolocationAddress) => void): void {
    this.geocode({
      latitude: coords.lat,
      longitude: coords.lng,
      isReverse: true,
    }).subscribe((result: Geocoder) => callback(result));
  }

  /**
   * This method get geolocation for map
   */
  private geocode(payload: Geocoder): Observable<Geocoder | null> {
    return this.http
      .post<GeocoderDTO>('/api/v1/Geocoding', { ...payload, lat: payload.latitude, lon: payload.longitude })
      .pipe(
        map((result: GeocoderDTO) => {
          return result ? { ...result, latitude: result.lat, longitude: result.lon } : null;
        })
      );
  }
}
