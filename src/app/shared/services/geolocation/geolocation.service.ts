import { City } from './../../models/city.model';
import { ConfirmCity, SetCity } from './../../store/filter.actions';
import { Store } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { Coords } from '../../models/coords.model';
import { Address } from '../../models/address.model';
import { GeolocationPositionError, GeolocationPosition } from '../../models/geolocation';
import { GeocoderService } from './geocoder.service'
import { HttpClient } from '@angular/common/http';
import { GeolocationAddress } from '../../models/geolocationAddress.model';

const kiev: City = {
  district: "м.Київ",
  id: 14446,
  longitude: 30.5595,
  latitude: 50.44029,
  name: "Київ",
  region: "м.Київ"
}

@Injectable({
  providedIn: 'root'
})

export class GeolocationService {
  userCoords = {
    lat: null,
    lng: null,
    city: ''
  };

  constructor(public store: Store, private http: HttpClient) { }

  /**
   * This method sets default city Kiev in localStorage if user deny geolocation 
   */
  confirmCity(): void {
    !!localStorage.getItem('cityConfirmation') ?
    this.store.dispatch([
      new ConfirmCity(false),
      new SetCity(JSON.parse(localStorage.getItem('cityConfirmation')))
    ]) :
    this.store.dispatch([
      new ConfirmCity(true), 
      new SetCity(kiev)
    ]);
  }

  navigatorRecievedError(err: GeolocationPositionError): void {
    console.warn(`ERROR(${err.code}): ${err.message}`);
    this.confirmCity();
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
  locationDecode(coords: Coords, callback: (GeolocationAddress) => void): void {
    GeocoderService.geocode().reverse(this.http, coords.lat, coords.lng, 'uk-UA, uk').subscribe((result: GeolocationAddress) => { // TODO: create enum for accept language param
      callback(result);
    });
  }

  /**
   * translates address into coords  
   *
   * @param address - Address
   */
  locationGeocode(address: Address, callback: (any) => void): void {
    GeocoderService.geocode(
      this.http,
      `${address.buildingNumber ? address.buildingNumber + '+' : ''}${address.street && (address.street.split(' ').join('+') + ',+')}${address.city && address.city.split(' ').join('+')}`,
      'uk-UA, uk'
    ).subscribe((result: GeolocationAddress | GeolocationAddress[]) => {
      const coords: [number, number] | null = (<GeolocationAddress[]>result).length > 0 ? [Number(result[0].lat), Number(result[0].lon)] : null;
      callback(coords);
    });
  }
}
