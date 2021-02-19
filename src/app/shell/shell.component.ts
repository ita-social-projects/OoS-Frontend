import { Component, OnInit } from '@angular/core';
import Geocoder from 'leaflet-control-geocoder';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent implements OnInit {

  constructor() { }

  navigatorRecievedCoords(data): void {
    const crd = data.coords;
    new Geocoder().options.geocoder.reverse({lat: crd.latitude, lng: crd.longitude}, 8, (result) =>{
     //this.SaveToState({city: result[0].properties.address.city, lng: crd.longitude, lat: crd.latitude})
    })
  };

  navigatorRecievedError(err): void {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  };

  ngOnInit(): void {
    //this.GeolocationService.handleUserLocation()
    navigator.geolocation.getCurrentPosition(this.navigatorRecievedCoords, this.navigatorRecievedError);
  }

}