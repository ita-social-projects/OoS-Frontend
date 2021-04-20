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
  }

  navigatorRecievedLocation(data, callback): void {
    callback({lat: data.coords.latitude, lng: data.coords.longitude});
  }
// gets user location (coords)
  handleUserLocation(callback): void {
    navigator.geolocation.getCurrentPosition(
      (data) => this.navigatorRecievedLocation(data, callback),
      this.navigatorRecievedError
    );
  }
// translates coords into address
  locationDecode(coords, callback): void {
    new Geocoder().options.geocoder.reverse(
      {lat: coords.lat, lng: coords.lng},
      18,
      (result) => {
        if (result.length > 0) {
          const city = result[0].properties.address.city;
          const street = result[0].properties.address.road;
          const buildingNumber = result[0].properties.address.house_number;
          callback({city, street, buildingNumber});
        } else {
          callback({
            city: '',
            street: '',
            buildingNumber: '',
          });
        }
      }
    );
  }
// translates address into coords
  async locationGeocode(address: {city: string, street: string, buildingNumber: string}): Promise<[number, number] | null> {
    const query = `${address.buildingNumber ? address.buildingNumber + '+' : ''}${address.street && (address.street.split(' ').join('+') + ',+')}${address.city && address.city.split(' ').join('+')}`;
    const url = `https://nominatim.openstreetmap.org/search?q=${query}&limit=5&format=json&addressdetails=1`;
    const result = await fetch(url);
    const json = await result.json();
    const coords: [number, number] | null = json.length > 0 ? [Number(json[0].lat), Number(json[0].lon)] : null;
    return coords;
  }
}
