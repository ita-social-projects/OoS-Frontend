import { Component, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import * as L from "leaflet";
import { FormGroup } from '@angular/forms';
import { GeolocationService } from 'src/app/shell/geolocation.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {
  @Input() address: FormGroup;
  @Output() setAddressEvent = new EventEmitter<FormGroup>();

  constructor(private geolocationService: GeolocationService) {}
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
      iconUrl: '../../../../assets/icons/marker.png',
    })
  };
  // Default Kyiv coords to set map center
  userCoords: [number, number] = [ 50.462235, 30.545131 ];
  // 1. creates and sets map after div with is "map" renders.
  // 2. Adds onclick event handler which translates map coords into address -> calls method to update parent component, after
  // that @input address changes
  // 3. subscribes on @input address change and on every change calls method to trenslate address into coords snd set marker on map
  ngAfterViewInit(): void {
    // before map creation gets user coords from GoelocationService.
    // If user didn't agree to share location with window.navigator, Kyiv coords used by default
    this.geolocationService.handleUserLocation((coords) => {
      if (coords) {
        this.userCoords = [coords.lat, coords.lng];
        this.map =  L.map('map').setView(this.userCoords, 11);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution:
            '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);
        // Adds onclick event handler
        this.map.on('click', e => this.setMapLocation(e.latlng));
      }
    });
    // tracks if @input address changed and calls setFormLocation with new address
    this.address.valueChanges.subscribe(dt => dt.street && dt.city && this.setFormLocation(dt));
  }
// uses GoelocationService to translate address into coords and sets marker on map
  async setFormLocation(address): Promise<void> {
    const coords = await this.geolocationService.locationGeocode(address);
    // tslint:disable-next-line: no-unused-expression
    coords && this.setMarker(coords);
  }
// uses GoelocationService to translate coords into address and sets emits event to update address in parent component
  setMapLocation(coords): void {
    this.geolocationService.locationDecode(coords, (address) => {
      this.setAddressEvent.emit(address);
    });
  }
// Adds marker to map
  setMarker(coords): void {
    // tslint:disable-next-line: no-unused-expression
    this.marker && this.map.removeLayer(this.marker);
    this.marker = new L.Marker(coords, {draggable: true, icon: this.markerIcon.icon});
    this.map.addLayer(this.marker);
  }
}
