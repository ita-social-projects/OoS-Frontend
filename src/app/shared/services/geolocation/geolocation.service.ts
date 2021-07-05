import { Injectable } from '@angular/core';
import Geocoder from 'leaflet-control-geocoder';
import { Coords } from '../../models/coords.model';
import { Address } from '../../models/address.model';
import { GeolocationPositionError, GeolocationPosition } from '../../models/geolocation';

@Injectable({
  providedIn: 'root'
})

export class GeolocationService {
  userCoords = {
    lat: null,
    lng: null,
    city: ''
  };

  constructor() {
  }

  navigatorRecievedError(err: GeolocationPositionError): void {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  navigatorRecievedLocation(data: GeolocationPosition, callback: (Coords: Coords) => void): void {
    callback({ lat: data.coords.latitude, lng: data.coords.longitude });
  }

  /**
   * gets user location
   * renders Kyiv map by default in case user denies Geolocation
   *
   * @param callback - Function, which recieves 1 argument of type Coords
   *
   */
  handleUserLocation(callback: (Coords?: Coords) => void): void {
    navigator.geolocation.getCurrentPosition(
      (data: GeolocationPosition) => this.navigatorRecievedLocation(data, callback),
      (error: GeolocationPositionError) => {
        this.navigatorRecievedError(error);
        callback();
      }
    );
  }

  /**
   * translates coords into address
   *
   * @param coords - Coords
   * @param callback - Function, which recieves 1 argument of type Address
   */
  locationDecode(coords: Coords, callback: (Address) => void): void {
    new Geocoder().options.geocoder.reverse(
      { lat: coords.lat, lng: coords.lng },
      18,
      (result) => {
        if (result.length > 0) {
          const city = result[0].properties.address.city;
          const street = result[0].properties.address.road;
          const buildingNumber = result[0].properties.address.house_number;
          callback({ city, street, buildingNumber });
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

  /**
   * translates address into coords
   *
   * @param address - Address
   */
  async locationGeocode(address: Address): Promise<[number, number] | null> {
    const query = `${address.buildingNumber ? address.buildingNumber + '+' : ''}${address.street && (address.street.split(' ').join('+') + ',+')}${address.city && address.city.split(' ').join('+')}`;
    const url = `https://nominatim.openstreetmap.org/search?q=${query}&limit=5&format=json&addressdetails=1`;
    const result = await fetch(url);
    const json = await result.json();
    const coords: [number, number] | null = json.length > 0 ? [Number(json[0].lat), Number(json[0].lon)] : null;
    return coords;
  }
}
