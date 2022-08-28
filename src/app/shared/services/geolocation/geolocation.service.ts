import { CodeficatorService } from './../codeficator/codeficator.service';
import { ConfirmCity, SetCity } from './../../store/filter.actions';
import { Store } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { Coords } from '../../models/coords.model';
import { GeolocationPositionError, GeolocationPosition } from '../../models/geolocation';
import { GeocoderService } from './geocoder.service';
import { HttpClient } from '@angular/common/http';
import { GeolocationAddress } from '../../models/geolocationAddress.model';
import { Address } from '../../models/address.model';
import { Constants } from '../../constants/constants';
import { Codeficator } from '../../models/codeficator.model';

@Injectable({
  providedIn: 'root',
})
export class GeolocationService {
  constructor(private store: Store, private http: HttpClient, private codeficatorService: CodeficatorService) {}

  /**
   * This method sets default city Kyiv in localStorage if user deny geolocation
   */
  confirmCity(settlement: Codeficator): void {
    !!localStorage.getItem('cityConfirmation')
      ? this.store.dispatch([new SetCity(JSON.parse(localStorage.getItem('cityConfirmation'))), new ConfirmCity(true)])
      : this.store.dispatch([new SetCity(settlement), new ConfirmCity(false)]);
  }

  navigatorRecievedError(err: GeolocationPositionError): void {
    console.warn(`ERROR(${err.code}): ${err.message}`);
    this.confirmCity(Constants.KYIV);
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
   * translates coords into codeficator address for filtering workshops
   * @param coords - Coords
   * @param callback - Function, which receives 1 argument of type Address
   */
  getNearestByCoordinates(coords: Coords, callback: (GeolocationAddress) => void): void {
    this.codeficatorService
      .getNearestByCoordinates(coords.lat, coords.lng)
      .subscribe((result: Codeficator) => callback(result));
  }

  /**
   * returns a location from a textual description or address.
   *
   * @param address - Address
   * @param callback - Function, which receives 1 argument of type Address
   */
  addressDecode(address: Address, callback: (GeolocationAddress) => void): void {
    GeocoderService.geocode(
      this.http,
      `${address.codeficatorAddressDto.settlement}+${address.street}+${address.buildingNumber}`,
      'uk-UA, uk' // TODO: create enum for accept language param
    ).subscribe((result: GeolocationAddress) => {
      callback(result);
    });
  }

  locationDecode(coords: Coords, callback: (GeolocationAddress) => void): void {
    GeocoderService.geocode()
      .reverse(this.http, coords.lat, coords.lng, 'uk-UA, uk') // TODO: create enum for accept language param
      .subscribe((result: GeolocationAddress) => {
        callback(result);
      });
  }
}
