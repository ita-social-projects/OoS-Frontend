import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';

import { Codeficator } from 'shared/models/codeficator.model';
import { Coords } from 'shared/models/coords.model';
import { GeolocationPosition, GeolocationPositionError } from 'shared/models/geolocation';
import { ConfirmCity, SetCity } from 'shared/store/filter.actions';
import { CodeficatorService } from '../codeficator/codeficator.service';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {
  constructor(
    private store: Store,
    private codeficatorService: CodeficatorService
  ) {}

  /**
   * This method sets default city Kyiv in localStorage if user deny geolocation
   */
  public confirmCity(settlement: Codeficator, isConfirmed: boolean): void {
    this.store.dispatch([new SetCity(settlement, isConfirmed), new ConfirmCity(isConfirmed)]);
  }

  public navigatorReceivedError(err: GeolocationPositionError): void {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  public navigatorReceivedLocation(data: GeolocationPosition, callback: (Coords: Coords) => void): void {
    callback({ lat: data.coords.latitude, lng: data.coords.longitude });
  }

  public isCityInStorage(): boolean {
    return !!localStorage.getItem('cityConfirmation');
  }

  public getCityFromStorage(): Codeficator {
    return JSON.parse(localStorage.getItem('cityConfirmation'));
  }

  /**
   * gets user location
   * renders Kyiv map by default in case user denies Geolocation
   *
   * @param callback - Function, which receives 1 argument of type Coords
   *
   */
  public handleUserLocation(callback: (Coords?: Coords) => void): void {
    navigator.geolocation.getCurrentPosition(
      (data: GeolocationPosition) => this.navigatorReceivedLocation(data, callback),
      (error: GeolocationPositionError) => {
        this.navigatorReceivedError(error);
        callback();
      }
    );
  }

  /**
   * translates coords into codeficator address for filtering workshops
   * @param coords - Coords
   * @param callback - Function, which receives 1 argument of type Address
   */
  public getNearestByCoordinates(coords: Coords, callback: (GeolocationAddress) => void): void {
    this.codeficatorService.getNearestByCoordinates(coords.lat, coords.lng).subscribe((result: Codeficator) => callback(result));
  }
}
