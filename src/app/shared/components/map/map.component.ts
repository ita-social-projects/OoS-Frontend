import { Codeficator } from './../../models/codeficator.model';
import { Component, AfterViewInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import * as Layer from 'leaflet';
import { FormGroup } from '@angular/forms';
import { GeolocationService } from 'src/app/shared/services/geolocation/geolocation.service';
import { Coords } from '../../models/coords.model';
import { Address, MapAddress } from '../../models/address.model';
import { Workshop, WorkshopCard, WorkshopFilterCard } from '../../models/workshop.model';
import { Select } from '@ngxs/store';
import { FilterState } from '../../store/filter.state';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { takeUntil, filter, debounceTime } from 'rxjs/operators';
import { GeolocationAddress } from '../../models/geolocationAddress.model';
import { UserState } from '../../store/user.state';
import { PreviousUrlService } from '../../services/previousUrl/previous-url.service';
import { WorkshopMarker } from '../../models/workshopMarker.model';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent {
  @Select(UserState.selectedWorkshop)
  selectedWorkshop$: Observable<Workshop>;
  public defaultCoords: Coords;
  public zoom = 11;
  public workshops: WorkshopCard[];

  @Select(FilterState.settlement)
  settlement$: Observable<Codeficator>;
  destroy$: Subject<boolean> = new Subject<boolean>();

  @Input() addressFormGroup: FormGroup;
  @Input() isCreateWorkShops: boolean;
  @Input() filteredWorkshops$: Observable<WorkshopFilterCard>;
  @Output() setAddressEvent = new EventEmitter<MapAddress>();
  @Output() selectedAddress = new EventEmitter<MapAddress>();

  constructor(private geolocationService: GeolocationService, private previousUrlService: PreviousUrlService) {}
  map: Layer.Map;
  singleMarker: Layer.Marker;
  workshopMarkers: WorkshopMarker[] = [];

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
  initMap(): void {
    this.map = Layer.map('map').setView(this.defaultCoords, this.zoom);

    Layer.tileLayer('https://tms{s}.visicom.ua/2.0.0/ua/base/{z}/{x}/{y}.png', {
      updateWhenZooming: true,
      subdomains: '123',
      maxZoom: 19,
      tms: true,
      attribution: "Дані карт © 2019 ПРаТ «<a href='https://api.visicom.ua/'>Визиком</a>»",
    }).addTo(this.map);

    this.map.on('click', (L: Layer.LeafletMouseEvent) => {
      if (this.workshops) {
        this.unselectMarkers();
        this.selectedAddress.emit(null);
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
    this.settlement$
      .pipe(
        takeUntil(this.destroy$),
        filter((settlement: Codeficator) => !!settlement)
      )
      .subscribe((settlement: Codeficator) => {
        this.defaultCoords = { lat: settlement.latitude, lng: settlement.longitude };
        this.map || this.initMap();
        this.flyTo(this.defaultCoords);

        // cheking if there are filtered workshops on the map
        if (!!this.filteredWorkshops$) {
          this.filteredWorkshops$.pipe(takeUntil(this.destroy$)).subscribe((filteredWorkshops: WorkshopFilterCard) => {
            this.workshopMarkers.forEach((workshopMarker: WorkshopMarker) =>
              this.map.removeLayer(workshopMarker.marker)
            );
            this.workshopMarkers = [];
            if (filteredWorkshops) {
              this.workshops = filteredWorkshops.entities;
              filteredWorkshops.entities.forEach((workshop: WorkshopCard) => this.setAddressLocation(workshop.address));
              this.setPrevWorkshopMarker();
            }
          });
        }
      });

    // cheking if user edit workshop information
    if (this.addressFormGroup) {
      this.addressFormGroup.value.latitude && this.setLocation(this.addressFormGroup.value);

      this.addressFormGroup.valueChanges.pipe(debounceTime(500)).subscribe((address: MapAddress) => {
        if (!address.street && !address.buildingNumber) {
          this.setAddressLocation(address);
        }
        if (address.codeficatorAddressDto && address.street && address.buildingNumber) {
          this.setLocation(address);
        }
      });
    }
  }

  /**
   * uses GoelocationService to translate address into coords and sets marker on efault
   * @param address - type Address
   */
  setAddressLocation(address: Address): void {
    this.workshops ? this.setWorkshopMarkers(address) : this.setNewSingleMarker([address.codeficatorAddressDto.latitude, address.codeficatorAddressDto.longitude]);
  }

  /**
   * uses GoelocationService to translate coords into address and sets emits event to update address in parent component
   * @param coords - type Coords
   */
  setMapLocation(coords: Coords): void {
    this.geolocationService.locationDecode(coords, (result: GeolocationAddress) => {
      if (result.address || (Array.isArray(result) && result.length)) {
        const location = result.address || result[0].properties.address;
        const codeficatorAddressDto = {
          settlement:location.city || location.village || location.town || location.hamlet
        } as Codeficator;
        const street = location.road;
        const buildingNumber = location.house_number;
        const longitude = result.lon || result[0].lon;
        const latitude = result.lat || result[0].lat;
        this.setAddressEvent.emit({ codeficatorAddressDto, street, buildingNumber, longitude, latitude });
      } else {
        this.setAddressEvent.emit({
          codeficatorAddressDto: null,
          street: null,
          buildingNumber: null,
        });
      }
    });
  }

  /**
   * uses GeolocationService to translate address into coords and sets marker on default
   * @param address - type Address
   */
  setLocation(address: MapAddress): void {
    this.geolocationService.addressDecode(address, (result: GeolocationAddress) => {
      if (result.address || (Array.isArray(result) && result.length)) {
        const coords: [number, number] = [result.lat || result[0].lat, result.lon || result[0].lon];
        this.setNewSingleMarker(coords);
      }
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
    this.map.flyTo(coords);
  }

  /**
   * This method remove existed marker and set the new marke to the map
   * @param coords - type [number, number]
   */
  setWorkshopMarkers(address: Address): void {
    const coords: [number, number] = [address.codeficatorAddressDto.latitude, address.codeficatorAddressDto.longitude];
    const marker = this.createMarker(coords, false);
    this.map.addLayer(marker);
    this.workshopMarkers.push({ marker, isSelected: false });

    marker.on('click', (event: Layer.LeafletMouseEvent) => {
      this.unselectMarkers();
      const targetMarker = this.workshopMarkers.find(workshopMarker => workshopMarker.marker === event.target);
      targetMarker.isSelected = true;
      targetMarker.marker.setIcon(this.selectedMarkerIcon);
      this.selectedAddress.emit({
        ...address,
        codeficatorAddressDto: address.codeficatorAddressDto,
      });
    });
  }

  setPrevWorkshopMarker(): void {
    this.selectedWorkshop$
      .pipe(
        filter((workshop: Workshop) => !!workshop),
        filter((workshop: Workshop) => '/workshop-details/' + workshop.id === this.previousUrlService.getPreviousUrl())
      )
      .subscribe((workshop: Workshop) => {
        const targetMarkers = this.workshopMarkers.filter((workshopMarker: WorkshopMarker) => {
          const { lat, lng } = workshopMarker.marker.getLatLng();
          return lat === workshop.address.codeficatorAddressDto.latitude && lng === workshop.address.codeficatorAddressDto.longitude;
        });
        targetMarkers.forEach((targetMarker: WorkshopMarker) => {
          targetMarker.isSelected = true;
          targetMarker.marker.setIcon(this.selectedMarkerIcon);
        });
        this.selectedAddress.emit({
          ...workshop.address,
          codeficatorAddressDto: workshop.address.codeficatorAddressDto,
        });
      });
  }

  /**
   * This method unselect target Marker
   */
  unselectMarkers(): void {
    const selectedWorkshopMarker = this.workshopMarkers.filter(
      (workshopMarker: WorkshopMarker) => workshopMarker.isSelected
    );
    if (selectedWorkshopMarker.length > 0) {
      selectedWorkshopMarker.forEach((targetMarker: WorkshopMarker) => {
        targetMarker.isSelected = false;
        targetMarker.marker.setIcon(this.unselectedMarkerIcon);
      });
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

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
