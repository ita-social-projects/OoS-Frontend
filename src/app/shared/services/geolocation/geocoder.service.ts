import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class GeocoderService {
  /**
   * Implementation of the [Nominatim](https://wiki.openstreetmap.org/wiki/Nominatim) geocoder.
   * 
   * [Nominatim Documentation](https://nominatim.org/release-docs/latest/api/Search/)
   * 
   * [Nominatim usage policy](https://operations.osmfoundation.org/policies/nominatim/).
   */
  private static url = 'https://nominatim.openstreetmap.org/';

  /**
   * Looks up a location from a textual description or address.
   * 
   * @param http HttpClient instance
   * @param query address description
   * @param lang language code
   * @returns response or reverse function
   */
  public static geocode(http?: HttpClient, query?: string, lang?: string): { reverse: Function } | Observable<Object> | any {
    return query ? 
              http.get(GeocoderService.url,
                {
                  headers: GeocoderService.getHeaders(lang),
                  params: new HttpParams()
                    .set('q', query)
                    .set('limit', '5')
                    .set('format', 'json')
                    .set('addressdetails', '1')
                }
              ) : 
              {
                reverse: GeocoderService.reverse
              };
  }

  /**
   * Reverse geocoding generates an address from a latitude and longitude.
   * 
   * @param http HttpClient instance
   * @param lat latitude
   * @param lon longitude
   * @param lang language code
   * @returns response
   */
  private static reverse(http: HttpClient, lat: string, lon: string, lang: string): Observable<Object> {
    return http.get(GeocoderService.url + `reverse`,
      { 
        headers: GeocoderService.getHeaders(lang),
        params: new HttpParams()
          .set('lat', lat)
          .set('lon', lon)
          .set('format', 'json')
      }
    );
  }

  /**
   * Generates Accept-Language header with specific language code
   * 
   * @param lang language code
   * @returns HttpHeaders
   */
  private static getHeaders(lang: string): HttpHeaders {
    return new HttpHeaders({
      'Accept-Language': lang
    });
  }
}
