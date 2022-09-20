import { Component, AfterViewInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import * as Layer from 'leaflet';
import { FormGroup } from '@angular/forms';
import { Coords } from '../../models/coords.model';
import { Address } from '../../models/address.model';
import { Workshop, WorkshopCard, WorkshopFilterCard } from '../../models/workshop.model';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { takeUntil, filter, debounceTime } from 'rxjs/operators';
import { SharedUserState } from '../../store/shared-user.state';
import { PreviousUrlService } from '../../services/previousUrl/previous-url.service';
import { WorkshopMarker } from '../../models/workshopMarker.model';
import { GeocoderService } from './../../services/geolocation/geocoder.service';
import { Geocoder } from './../../models/geolocation';
import { Codeficator } from './../../models/codeficator.model';
import { FilterState } from '../../store/filter.state';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements AfterViewInit, OnDestroy {
  @Input() addressFormGroup: FormGroup;
  @Input() filteredWorkshops$: Observable<WorkshopFilterCard>;

  @Output() addressSelect = new EventEmitter<Geocoder>();

  @Select(SharedUserState.selectedWorkshop)
  selectedWorkshop$: Observable<Workshop>;
  @Select(FilterState.settlement)
  settlement$: Observable<Codeficator>;

  destroy$: Subject<boolean> = new Subject<boolean>();
  map: Layer.Map;

  private singleMarker: Layer.Marker;
  private workshopMarkers: WorkshopMarker[] = [];
  private defaultCoords: Coords;
  private zoom = 11;
  private workshops: WorkshopCard[];
  private unselectedMarkerIcon: Layer.Icon = Layer.icon({
    iconSize: [25, 25],
    shadowSize: [0, 0],
    iconAnchor: [10, 41],
    shadowAnchor: [0, 0],
    popupAnchor: [-3, -76],
    iconUrl: '/assets/icons/marker.png',
  });
  private selectedMarkerIcon: Layer.Icon = Layer.icon({
    iconSize: [25, 25],
    shadowSize: [0, 0],
    iconAnchor: [10, 41],
    shadowAnchor: [0, 0],
    popupAnchor: [-3, -76],
    iconUrl: '/assets/icons/selectMarker.png',
  });

  constructor(private geocoderService: GeocoderService, private previousUrlService: PreviousUrlService) {}

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

        // checking if there are filtered workshops on the map for teh result page view
        if (!!this.filteredWorkshops$) {
          this.setFilteredWorkshops();
        }
        // checking if user edit workshop information to create adress for workshop
        if (this.addressFormGroup) {
          this.setAddress();
        }
      });
  }

  private setFilteredWorkshops(): void {
    this.filteredWorkshops$.pipe(takeUntil(this.destroy$)).subscribe((filteredWorkshops: WorkshopFilterCard) => {
      this.workshopMarkers.forEach((workshopMarker: WorkshopMarker) => this.map.removeLayer(workshopMarker.marker));
      this.workshopMarkers = [];
      if (filteredWorkshops) {
        this.workshops = filteredWorkshops.entities;
        filteredWorkshops.entities.forEach((workshop: WorkshopCard) => this.setAddressLocation(workshop.address));
        this.setPrevWorkshopMarker();
      }
    });
  }

  private setAddress(): void {
    const address: Geocoder = this.addressFormGroup.getRawValue();
    if (address.catottgId) {
      this.addressDecode(address);
    }

    this.addressFormGroup.valueChanges
      .pipe(debounceTime(500), takeUntil(this.destroy$))
      .subscribe((address: Geocoder) => this.addressDecode(address));
  }

  /**
   * changing position on map
   * @param coords:Coords
   */
  private flyTo(coords: Coords): void {
    this.map?.flyTo(coords, this.zoom);
  }

  /**
   * method init start position on map
   */
  private initMap(): void {
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
        this.addressSelect.emit(null);
      } else {
        this.setMapLocation(L.latlng);
      }
    });
  }

  /**
   * uses GoelocationService to translate address into coords and sets marker on default
   * @param address - type Address
   */
  private setAddressLocation(address: Address): void {
    this.workshops
      ? this.setWorkshopMarkers(address)
      : this.setNewSingleMarker([address.codeficatorAddressDto.latitude, address.codeficatorAddressDto.longitude]);
  }

  /**
   * uses GoelocationService to translate coords into address and sets emits event to update address in parent component
   * @param coords - type Coords
   */
  private setMapLocation(coords: Coords): void {
    this.geocoderService.locationDecode(coords, (result: Geocoder) => {
      if (result) {
        this.addressFormGroup.patchValue(result);
      } else {
        this.addressFormGroup.reset();
        this.map.removeLayer(this.singleMarker);
      }
      this.addressSelect.emit(result);
    });
  }

  private addressDecode(address: Geocoder): void {
    this.geocoderService.addressDecode(address, (result: Geocoder) => {
      if (result) {
        this.setNewSingleMarker([result.latitude, result.longitude]);
      } else {
        this.map.removeLayer(this.singleMarker);
      }
    });
  }

  /**
   * This method remove existed marker and set the new marke to the map
   * @param coords - type [number, number]
   */
  private setNewSingleMarker(coords: [number, number]): void {
    this.singleMarker && this.map.removeLayer(this.singleMarker);
    this.singleMarker = this.createMarker(coords);
    this.map.addLayer(this.singleMarker);
    this.map.flyTo(coords);
  }

  /**
   * This method remove existed marker and set the new marke to the map
   * @param coords - type [number, number]
   */
  private setWorkshopMarkers(address: Address): void {
    const coords: [number, number] = [address.codeficatorAddressDto.latitude, address.codeficatorAddressDto.longitude];
    const marker = this.createMarker(coords, false);
    this.map.addLayer(marker);
    this.workshopMarkers.push({ marker, isSelected: false });

    marker.on('click', (event: Layer.LeafletMouseEvent) => {
      this.unselectMarkers();
      const targetMarker = this.workshopMarkers.find(workshopMarker => workshopMarker.marker === event.target);
      targetMarker.isSelected = true;
      targetMarker.marker.setIcon(this.selectedMarkerIcon);
      // this.selectedAddress.emit({
      //   ...address,
      //   codeficatorAddressDto: address.codeficatorAddressDto,
      // });
    });
  }

  private setPrevWorkshopMarker(): void {
    this.selectedWorkshop$
      .pipe(
        filter((workshop: Workshop) => !!workshop),
        filter((workshop: Workshop) => '/workshop-details/' + workshop.id === this.previousUrlService.getPreviousUrl())
      )
      .subscribe((workshop: Workshop) => {
        const targetMarkers = this.workshopMarkers.filter((workshopMarker: WorkshopMarker) => {
          const { lat, lng } = workshopMarker.marker.getLatLng();
          return (
            lat === workshop.address.codeficatorAddressDto.latitude &&
            lng === workshop.address.codeficatorAddressDto.longitude
          );
        });
        targetMarkers.forEach((targetMarker: WorkshopMarker) => {
          targetMarker.isSelected = true;
          targetMarker.marker.setIcon(this.selectedMarkerIcon);
        });
        // this.selectedAddress.emit({
        //   ...workshop.address,
        //   codeficatorAddressDto: workshop.address.codeficatorAddressDto,
        // });
      });
  }

  /**
   * This method unselect target Marker
   */
  private unselectMarkers(): void {
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
  private createMarker(coords: [number, number], draggable: boolean = true): Layer.Marker {
    return new Layer.Marker(coords, { draggable, icon: this.unselectedMarkerIcon, riseOnHover: true });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
