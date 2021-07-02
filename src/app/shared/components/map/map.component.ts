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

  defaultKievCoords: Coords = { lat: 50.462235, lng: 30.545131 };
  zoom: number = 11;

  @Input() addressFormGroup: FormGroup;
  @Input() workshops: Workshop[];

  @Output() setAddressEvent = new EventEmitter<Address>();
  @Output() selectedAddress = new EventEmitter<Address>();

  constructor(private geolocationService: GeolocationService) { }

  map: Layer.Map;
  singleMarker: Layer.Marker;
  isSelectedMarker: boolean = false;
  workshopMarkers: {
    id: number,
    marker: Layer.Marker,
    isSelected?: boolean
  }[] = [];

  unselectedMarkerIcon: Layer.Icon = Layer.icon({
    iconSize: [25, 25],
    shadowSize: [0, 0],
    iconAnchor: [10, 41],
    shadowAnchor: [0, 0],
    popupAnchor: [-3, -76],
    iconUrl: '/assets/icons/marker.png',
  });

  selectedMarkerIcon: Layer.Icon = Layer.icon({
    iconSize: [25, 25],
    shadowSize: [0, 0],
    iconAnchor: [10, 41],
    shadowAnchor: [0, 0],
    popupAnchor: [-3, -76],
    iconUrl: '/assets/icons/selectMarker.png',
  });

  /**
   * before map creation gets user coords from GeolocationService. If no user coords uses default coords
   * Creates and sets map after div with is "map" renders.
   * Adds onclick event handler which translates map coords into address
   * subscribes on @input address change and on every change calls method to translate address into coords
   */
  ngAfterViewInit(): void {
    this.geolocationService.handleUserLocation((coords: Coords) => {

      const defaultCoords = coords ? coords : this.defaultKievCoords;

      this.map = Layer.map('map').setView(defaultCoords, this.zoom);

      Layer.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        updateWhenZooming: true,
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);

      this.map.on('click', (L: Layer.LeafletMouseEvent) => this.workshops ? this.selectedAddress.emit(null) : this.setMapLocation(L.latlng));
    });

    this.addressFormGroup && this.addressFormGroup.valueChanges.subscribe((address: Address) => address && this.setAddressLocation(address));

    this.workshops && this.workshops.forEach((workshop: Workshop) => this.setAddressLocation(workshop.address, workshop.id));
  }

  /**
   * uses GoelocationService to translate address into coords and sets marker on efault
   * @param address - type Address
   */
  async setAddressLocation(address: Address, workshopId?: number): Promise<void> {
    const coords = await this.geolocationService.locationGeocode(address);
    if (coords) {
      workshopId ? this.setWorkshopMarkers(coords, address, workshopId) : this.setNewSingleMarker(coords);
    }
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
   * This method remove existed marker and set the new marke to the map
   * @param coords - type [number, number]
   */
  setNewSingleMarker(coords: [number, number]): void {
    this.singleMarker && this.map.removeLayer(this.singleMarker);
    this.singleMarker = this.createMarker(coords);
    this.map.addLayer(this.singleMarker);
  }

  /**
   * This method remove existed marker and set the new marke to the map
   * @param coords - type [number, number]
   */
  setWorkshopMarkers(coords: [number, number], address: Address, id: number): void {
    let marker = this.createMarker(coords, false);
    this.map.addLayer(marker);
    this.workshopMarkers.push({ id, marker, isSelected: false });


    marker.on('click', (event: Layer.LeafletMouseEvent) => {
      const targetMarker: Layer.Marker = event.target;

      this.isSelectedMarker = !this.isSelectedMarker;

      this.isSelectedMarker ? targetMarker.setIcon(this.selectedMarkerIcon) : targetMarker.setIcon(this.unselectedMarkerIcon);
      console.log(this.map)

      // targetMarker.setIcon(this.selectedMarkerIcon);
      // if (this.isSelectedMarker) {
      //   const selectedMarker = this.workshopMarkers.find((workshopMarkes) => workshopMarkes.isSelected);
      //   selectedMarker.isSelected = false;
      //   selectedMarker.marker.setIcon(this.unselectedMarkerIcon);
      // }

      // const newSelectedMarker = this.workshopMarkers.find((workshopMarkes) => workshopMarkes.id = id);
      // newSelectedMarker.isSelected = true;
      // newSelectedMarker.marker.setIcon(this.selectedMarkerIcon);
      // this.selectedAddress.emit(address);
    });


  }

  /**
  * This method creates new marker
  * @param coords - type [number, number]
  * @param draggable - type boolean
  * @param address - type Address
  */
  createMarker(coords: [number, number], draggable: boolean = true): Layer.Marker {
    return new Layer.Marker(coords, { draggable, icon: this.unselectedMarkerIcon, riseOnHover: true });
  }

}
