import { Component, AfterViewInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import * as Layer from 'leaflet';
import { FormGroup } from '@angular/forms';
import { GeolocationService } from 'src/app/shared/services/geolocation/geolocation.service';
import { Coords } from '../../models/coords.model';
import { Address } from '../../models/address.model';
import { WorkshopCard, WorkshopFilterCard } from '../../models/workshop.model';
import { Select, Store } from '@ngxs/store';
import { FilterState } from '../../store/filter.state';
import { Observable } from 'rxjs';
import { City } from '../../models/city.model';
import { Subject } from 'rxjs';
import { takeUntil, filter, debounce, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit, OnDestroy{

  @Select(FilterState.city)
  city$ :Observable<City>;

  @Select(FilterState.filteredWorkshops)
  filteredWorkshops$: Observable<WorkshopFilterCard>;

  destroy$: Subject<boolean> = new Subject<boolean>();

  public defaultCoords: Coords;
  public zoom: number = 11;
  public workshops: WorkshopCard[];

  @Input() addressFormGroup: FormGroup;
  @Input() isCreateWorkShops: boolean ;

  @Output() setAddressEvent = new EventEmitter<Address>();
  @Output() selectedAddress = new EventEmitter<Address>();

  constructor(private geolocationService: GeolocationService) { }

  map: Layer.Map;
  singleMarker: Layer.Marker;
  workshopMarkers: {
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
 * changing position on map
 * @param coords:Coords
 */
  flyTo(coords: Coords): void {
    this.map?.flyTo(coords, this.zoom);
  }

/**
 * method init start position on map
 */
  initMap():void {
    this.map = Layer.map('map').setView(this.defaultCoords, this.zoom);

    Layer.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      updateWhenZooming: true,
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    this.map.on('click', (L: Layer.LeafletMouseEvent) => {
      if (this.workshops) {
        this.unselectMarkers();
        this.selectedAddress.emit(null)
      } else {
        this.setMapLocation(L.latlng);
      }
    });
  }

  /**
   * before map creation gets user coords from GeolocationService. If no user coords uses default coords
   * Creates and sets map after div with is "map" renders.
   * Adds onclick event handler which translates map coords into address
   * subscribes on @input address change and on every change calls method to translate address into coords
   */
  ngAfterViewInit(): void {

    this.city$
    .pipe(takeUntil(this.destroy$), filter((city)=> !!city))
    .subscribe((city)=> {
        this.defaultCoords = {lat: city.latitude, lng: city.longitude};
        this.map || this.initMap();
        this.flyTo(this.defaultCoords);
    });

    if (!this.isCreateWorkShops) {

      this.filteredWorkshops$
      .pipe(takeUntil(this.destroy$), filter((filteredWorkshops)=> !!filteredWorkshops))
      .subscribe(filteredWorkshops => {
        this.workshopMarkers.map((m) => this.map.removeLayer(m.marker));
        this.workshopMarkers = [];
        this.workshops = filteredWorkshops.entities;
        filteredWorkshops.entities.forEach((workshop: WorkshopCard) => this.setAddressLocation(workshop.address));
      });
    } else {
      //cheking if user edit workshop information
      if (this.addressFormGroup.value.latitude) this.setAddressLocation(this.addressFormGroup.value);

      this.addressFormGroup.valueChanges.pipe(
        debounceTime(500)
      ).subscribe((address: Address) => {
        this.geolocationService.locationGeocode(address, (result) => {
          address.longitude = result ? result[1] : 0;
          address.latitude = result ? result[0] : 0;
          this.setAddressLocation(address);
        });
      });

    }


  }

  /**
   * uses GoelocationService to translate address into coords and sets marker on efault
   * @param address - type Address
   */
  setAddressLocation(address: Address): void {
    this.workshops ? this.setWorkshopMarkers(address) : this.setNewSingleMarker(address);
  }

  /**
   * uses GoelocationService to translate coords into address and sets emits event to update address in parent component
   * @param coords - type Coords
   */
  setMapLocation(coords: Coords): void {
    this.geolocationService.locationDecode(coords, (result: any) => { // TODO: add model for geocoder response
      if (result.address || (Array.isArray(result) && result.length)) {
        const location = result.address || result[0].properties.address;
        const city = location.city || location.village || location.town || location.hamlet;
        const street = location.road;
        const buildingNumber = location.house_number;
        const longitude = result.lon || result[0].lon;
        const latitude = result.lat || result[0].lat;
        this.setAddressEvent.emit({ city, street, buildingNumber, longitude, latitude });
      } else {
        this.setAddressEvent.emit({
          city: '',
          street: '',
          buildingNumber: '',
        });
      }

    });
  }

  /**
   * This method remove existed marker and set the new marke to the map
   * @param coords - type [number, number]
   */
  setNewSingleMarker(address: Address): void {
    const coords: [number, number] = [address.latitude, address.longitude];
    this.singleMarker && this.map.removeLayer(this.singleMarker);
    this.singleMarker = this.createMarker(coords);
    this.map.addLayer(this.singleMarker);
    this.map.flyTo(coords);
  }

  /**
   * This method remove existed marker and set the new marke to the map
   * @param coords - type [number, number]
   */
  setWorkshopMarkers(address: Address): void {
    const coords: [number, number] = [address.latitude, address.longitude];
    const marker = this.createMarker(coords, false);
    this.map.addLayer(marker);
    this.workshopMarkers.push({ marker, isSelected: false });

    marker.on('click', (event: Layer.LeafletMouseEvent) => {
      this.unselectMarkers();

      const targetMarker = this.workshopMarkers.find((workshopMarker) => workshopMarker.marker === event.target);
      targetMarker.isSelected = true;

      targetMarker.isSelected ? targetMarker.marker.setIcon(this.selectedMarkerIcon) : targetMarker.marker.setIcon(this.unselectedMarkerIcon);
      this.selectedAddress.emit(address);
    });
  }

  /**
   * This method unselect target Marker
   */
  unselectMarkers(): void {
    const selectedWorkshopMarker = this.workshopMarkers.find((workshopMarkes) => workshopMarkes.isSelected);
    if (selectedWorkshopMarker) {
      selectedWorkshopMarker.isSelected = false;
      selectedWorkshopMarker.marker.setIcon(this.unselectedMarkerIcon);
    }
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

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
