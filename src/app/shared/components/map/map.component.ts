import { Component, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import * as Layer from 'leaflet';
import { FormGroup } from '@angular/forms';
import { GeolocationService } from 'src/app/shared/services/geolocation/geolocation.service';
import { Coords } from '../../models/coords.model';
import { Address } from '../../models/address.model';
import { Workshop } from '../../models/workshop.model';

const markerIcon = '/assets/icons/marker.png';
const selectedMarkerIcon = '/assets/icons/selectMarker.png';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {

  /**
   * Sets Kyiv coords as map center by default
   */
  defaultCoords: [number, number];

  @Input() addressFormGroup: FormGroup;
  @Input() workshops: Workshop[];

  @Output() setAddressEvent = new EventEmitter<Address>();
  @Output() selectedAddress = new EventEmitter<Address>();

  constructor(private geolocationService: GeolocationService) { }

  map: Layer.Map;
  marker: Layer.Marker;
  markerIcon: Layer.Icon = Layer.icon({
    iconSize: [25, 25],
    shadowSize: [0, 0],
    iconAnchor: [10, 41],
    shadowAnchor: [0, 0],
    popupAnchor: [-3, -76],
    iconUrl: markerIcon,
  });

  /**
   * before map creation gets user coords from GeolocationService. If no user coords uses default coords
   * Creates and sets map after div with is "map" renders.
   * Adds onclick event handler which translates map coords into address
   * subscribes on @input address change and on every change calls method to translate address into coords
   */
  ngAfterViewInit(): void {
    // set Kyiv geodata in coords by default in case user denies Geolocation
    this.geolocationService.handleUserLocation((coords: Coords = { lat: 50.462235, lng: 30.545131 }) => {

      this.defaultCoords = [coords.lat, coords.lng];

      this.map = Layer.map('map').setView(this.defaultCoords, 11);

      Layer.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);

      this.map.on('click', (L: Layer.LeafletMouseEvent) => this.setMapLocation(L.latlng));
    });

    if (this.addressFormGroup) {
      this.addressFormGroup.valueChanges
        .subscribe((address: Address) => address && this.setFormLocation(address));
    }

    //this.workshops && this.workshops.forEach((workshop: Workshop)=> this.setFormLocation(workshop.address));
  }

  /**
   * uses GoelocationService to translate address into coords and sets marker on map
   * @param address - type Address
   */
  async setFormLocation(address: Address): Promise<void> {
    const coords = await this.geolocationService.locationGeocode(address);
    // tslint:disable-next-line: no-unused-expression
    coords && this.setMarker(coords, address);
  }

  /**
   * uses GoelocationService to translate coords into address and sets emits event to update address in parent component
   * @param coords - type Coords
   */
  setMapLocation(coords: Coords): void {
    this.geolocationService.locationDecode(coords, (address: Address) => {
      this.setAddressEvent.emit(address);
    });
  }

  /**
   * Adds marker to map
   * @param coords - type [number, number]
   */
  setMarker(coords: [number, number], address?: Address): void {
    this.marker && this.map.removeLayer(this.marker);
    this.marker = new Layer.Marker(coords, { draggable: true, icon: this.markerIcon });
    this.map.addLayer(this.marker);

    // this.workshops && this.marker.on('click', ()=>{
    //   this.selectedAddress.emit(address);
    // });
  }

}
