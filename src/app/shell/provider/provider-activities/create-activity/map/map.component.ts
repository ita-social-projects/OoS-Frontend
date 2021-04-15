import { Component, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import * as L from "leaflet";
import { FormArray, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {
  private _address: FormGroup;
  @Input() set address(value: FormGroup) {
    this._address = value;
    console.log(this._address);
  }
  get address(): FormGroup {
   return this._address;
  }
  map;
  marker;
  mainLayer;
  markerIcon = {
    icon: L.icon({
      iconSize: [25, 25],
      shadowSize: [0, 0],
      iconAnchor: [10, 41],
      shadowAnchor: [0, 0],
      popupAnchor: [-3, -76],
      iconUrl: '../../../../assets/icons/robo.png',
    })
  };

  ngAfterViewInit(): void {
    this.map = L.map('map').setView([ 50.462235, 30.545131 ], 11);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
    this.map.on('click', e => this.setMarker(e.latlng));
  }
  setMarker(coords): void {
    this.marker && this.map.removeLayer(this.marker);
    this.marker = new L.Marker(coords, {draggable: true, icon: this.markerIcon.icon});
    this.map.addLayer(this.marker);
  }
}
