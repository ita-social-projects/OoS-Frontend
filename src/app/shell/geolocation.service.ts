import {Injectable} from '@angular/core';
import Geocoder from 'leaflet-control-geocoder';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {
  userCoords = {
    childCards: [],
    lat: null,
    lng: null,
    city: ''
  };

  constructor() {
  }

  navigatorRecievedError(err): void {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  };

  handleUserLocation(callback): void {
    navigator.geolocation.getCurrentPosition(
      (data) => {
        this.userCoords.lat = data.coords.latitude;
        this.userCoords.lng = data.coords.longitude;
        new Geocoder().options.geocoder.reverse(
          {lat: this.userCoords.lat, lng: this.userCoords.lng},
          8,
          (result) => {
            this.userCoords.city = result[0].properties.address.city;
            callback(this.userCoords);
          }
        );
      },
      this.navigatorRecievedError
    );

  }
}
