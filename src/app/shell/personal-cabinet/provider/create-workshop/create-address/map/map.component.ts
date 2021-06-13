import { Component, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import * as Layer from 'leaflet';
import { FormGroup } from '@angular/forms';
import { GeolocationService } from 'src/app/shared/services/geolocation/geolocation.service';
import { Coords } from '../../../../../../shared/models/coords.model';
import { Address } from '../../../../../../shared/models/address.model';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {
  @Input() address: FormGroup;
  @Output() setAddressEvent = new EventEmitter<FormGroup>();

  constructor(private geolocationService: GeolocationService) { }
  map;
  marker;
  mainLayer;
  markerIcon = {
    icon: Layer.icon({
      iconSize: [25, 25],
      shadowSize: [0, 0],
      iconAnchor: [10, 41],
      shadowAnchor: [0, 0],
      popupAnchor: [-3, -76],
      iconUrl: '../../../../assets/icons/marker.png',
    })
  };
  /**
   * Sets Kyiv coords as map center by default
   */
  userCoords: [number, number] = [50.462235, 30.545131];
  /**
   * before map creation gets user coords from GeolocationService. If no user coords uses default coords
   * Creates and sets map after div with is "map" renders.
   * Adds onclick event handler which translates map coords into address
   * subscribes on @input address change and on every change calls method to translate address into coords
   */
  ngAfterViewInit(): void {
    this.geolocationService.handleUserLocation((coords: Coords) => {
      if (coords) {
        this.userCoords = [coords.lat, coords.lng];
        this.map = Layer.map('map').setView(this.userCoords, 11);
        Layer.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution:
            '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);
        this.map.on('click', e => this.setMapLocation(e.latlng));
      }
    });
    this.address.valueChanges.subscribe((dt: Address) => dt.street && dt.city && this.setFormLocation(dt));
  }
  /**
   * uses GoelocationService to translate address into coords and sets marker on map
   *
   * @param address - type Address
   */
  async setFormLocation(address: Address): Promise<void> {
    const coords = await this.geolocationService.locationGeocode(address);
    // tslint:disable-next-line: no-unused-expression
    coords && this.setMarker(coords);
  }
  /**
   * uses GoelocationService to translate coords into address and sets emits event to update address in parent component
   *
   * @param coords - type Coords
   */
  setMapLocation(coords: Coords): void {
    this.geolocationService.locationDecode(coords, (address) => {
      this.setAddressEvent.emit(address);
    });
  }
  /**
   * Adds marker to map
   *
   * @param coords - type [number, number]
   */
  setMarker(coords: [number, number]): void {
    // tslint:disable-next-line: no-unused-expression
    this.marker && this.map.removeLayer(this.marker);
    this.marker = new Layer.Marker(coords, { draggable: true, icon: this.markerIcon.icon });
    this.map.addLayer(this.marker);
  }
}
