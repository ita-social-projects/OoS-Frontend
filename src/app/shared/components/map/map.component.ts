import { Component, AfterViewInit, Input, Output, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import * as Layer from 'leaflet';
import { FormGroup } from '@angular/forms';
import { Coords } from '../../models/coords.model';
import { Address } from '../../models/address.model';
import { Workshop, WorkshopCard } from '../../models/workshop.model';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { takeUntil, filter, debounceTime, switchMap, take, delay } from 'rxjs/operators';
import { SharedUserState } from '../../store/shared-user.state';
import { WorkshopMarker } from '../../models/workshopMarker.model';
import { GeocoderService } from './../../services/geolocation/geocoder.service';
import { Geocoder } from './../../models/geolocation';
import { Codeficator } from './../../models/codeficator.model';
import { FilterState } from '../../store/filter.state';
import { SearchResponse } from '../../models/search.model';
import { SetCoordsByMap } from '../../store/filter.actions';
import { ShowMessageBar } from '../../store/app.actions';
import { SnackbarText } from '../../enum/enumUA/messageBer';
import { GeolocationService } from 'shared/services/geolocation/geolocation.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() addressFormGroup: FormGroup;
  @Input() settelmentFormGroup: FormGroup;

  @Input() filteredWorkshops$: Observable<SearchResponse<WorkshopCard[]>>;

  @Output() addressSelect = new EventEmitter<Geocoder>();
  @Output() selectedWorkshopAddress = new EventEmitter<Address>();

  @Select(SharedUserState.selectedWorkshop)
  selectedWorkshop$: Observable<Workshop>;
  @Select(FilterState.settlement)
  settlement$: Observable<Codeficator>;
  @Select(FilterState.userRadiusSize)
  userRadiusSize$: Observable<number>;

  destroy$: Subject<boolean> = new Subject<boolean>();
  map: Layer.Map;

  private singleMarker: Layer.Marker;
  private workshopMarkers: WorkshopMarker[] = [];
  private defaultCoords: Coords;
  private zoom = 11;
  private workshops: WorkshopCard[];
  private customCoords: Coords;
  private userMarker: Layer.Marker;
  private geolocationMarker: Layer.Marker;
  private userRadius: Layer.Circle;
  private radiusSize: number;
  private unselectedMarkerIcon: Layer.Icon = Layer.icon({
    iconSize: [25, 25],
    shadowSize: [0, 0],
    iconAnchor: [10, 41],
    shadowAnchor: [0, 0],
    popupAnchor: [-3, -76],
    iconUrl: '/assets/icons/marker.png'
  });
  private selectedMarkerIcon: Layer.Icon = Layer.icon({
    iconSize: [25, 25],
    shadowSize: [0, 0],
    iconAnchor: [10, 41],
    shadowAnchor: [0, 0],
    popupAnchor: [-3, -76],
    iconUrl: '/assets/icons/selectMarker.png'
  });
  private userIcon: Layer.Icon = Layer.icon({
    iconSize: [35, 35],
    shadowSize: [0, 0],
    iconAnchor: [16, 17],
    shadowAnchor: [0, 0],
    popupAnchor: [-3, -76],
    iconUrl: '/assets/icons/user_dot.svg'
  });
  private geolocationMarkerIcon: Layer.Icon = Layer.icon({
    iconSize: [40, 40],
    shadowSize: [0, 0],
    iconAnchor: [10, 41],
    popupAnchor: [9, -40],
    iconUrl: '/assets/icons/geolocation-marker.svg'
  });

  constructor(private geocoderService: GeocoderService, private store: Store, private geolocationService: GeolocationService, private translateService: TranslateService) {}
  
  ngOnInit(): void {
    this.changeLanguageOnMarkerPopup();
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
        this.defaultCoords = {
          lat: settlement.latitude,
          lng: settlement.longitude
        };
        this.map || this.initMap();
        this.flyTo(this.defaultCoords);

        // checking if there are filtered workshops on the map for teh result page view
        if (!!this.filteredWorkshops$) {
          this.createUserRadius();
          this.setFilteredWorkshops();
          this.showWarningMessage(SnackbarText.mapWarning, 'warningBlue', true);
        }

        // checking if user edit workshop information to create adress for workshop
        if (this.addressFormGroup) {
          this.setAddress();
        }
      });

    this.settlement$
      .pipe(        
        takeUntil(this.destroy$),
        delay(3000),
        take(1)
      )
      .subscribe(() => this.setCurrentGeolocation());
  }

  public setCurrentGeolocation(): void {
    this.geolocationService.handleUserLocation((coords: Coords) => {
      if (coords) {
        this.setGeolocationMarkerOnMap(coords);
        this.geolocationService.getNearestByCoordinates(coords, (result: Codeficator) => {
          if (this.geolocationService.getCityFromStorage()) {
            (this.geolocationService.getCityFromStorage().id === result.id)
              ? this.geolocationService.confirmCity(result, true)
              : this.geolocationService.confirmCity(result, false);
          } else {
            this.geolocationService.confirmCity(result, false);
          }
        });
      } else {
        this.showWarningMessage(SnackbarText.geolocationWarning, 'warningYellow', true);
      }
    });    
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
      attribution: "Дані карт © 2019 ПРаТ «<a href='https://api.visicom.ua/'>Визиком</a>»"
    }).addTo(this.map);

    this.map.on('click', (L: Layer.LeafletMouseEvent) => {
      if (this.workshops) {
        this.unselectMarkers();
        this.selectedWorkshopAddress.emit(null);
      } else {
        this.setMapLocation(L.latlng);
      }
    });
  }

  private setGeolocationMarkerOnMap(coords: Coords): void {
    this.geolocationMarker && this.geolocationMarker.remove();
    this.translateService.get('GEOLOCATION_MARKER_TITLE').pipe(takeUntil(this.destroy$)).subscribe((popupText: string) => {
      this.geolocationMarker = Layer
        .marker(coords, {icon: this.geolocationMarkerIcon, zIndexOffset: 1})
        .addTo(this.map)
        .bindPopup(`<p>${popupText}</p>`)
        .openPopup();
    });
  }

  private changeLanguageOnMarkerPopup(): void {
    this.translateService.onLangChange.pipe(
      takeUntil(this.destroy$),
      switchMap(() => {
        return this.translateService.get('GEOLOCATION_MARKER_TITLE');
      }))
      .subscribe((translation: string) => {
        this.geolocationMarker && this.geolocationMarker.setPopupContent(`<p>${translation}</p>`);
      });
  }
 
  private setFilteredWorkshops(): void {
    this.filteredWorkshops$.pipe(takeUntil(this.destroy$)).subscribe((filteredWorkshops: SearchResponse<WorkshopCard[]>) => {
      this.workshopMarkers.forEach((workshopMarker: WorkshopMarker) => this.map.removeLayer(workshopMarker.marker));
      this.workshopMarkers = [];
      if (filteredWorkshops) {
        this.workshops = filteredWorkshops.entities;
        filteredWorkshops.entities.forEach((workshop: WorkshopCard) => this.setWorkshopMarkers(workshop.address));
      }
    });
  }

  private setAddress(): void {
    const address: Geocoder = this.addressFormGroup.getRawValue();
    if (address.catottgId) {
      this.setNewSingleMarker([this.addressFormGroup.value.lat, this.addressFormGroup.value.lon]);
    }
    this.addressFormGroup.valueChanges.pipe(debounceTime(500), takeUntil(this.destroy$)).subscribe((address: Geocoder) => {
      if (this.addressFormGroup.valid) {
        this.addressDecode(address);
      }
    });
  }

  /**
   * uses GoelocationService to translate coords into address and sets emits event to update address in parent component
   * @param coords - type Coords
   */
  private setMapLocation(coords: Coords): void {
    this.geocoderService.locationDecode(coords, (result: Geocoder) => {
      if (result) {
        this.setNewSingleMarker([result.lat, result.lon]);
        this.addressFormGroup.patchValue(result, { emitEvent: false });
      } else {
        this.addressFormGroup.reset({ catottgId: this.addressFormGroup.value.catottgId }, { emitEvent: false });
        this.map.removeLayer(this.singleMarker);
      }
      this.addressSelect.emit(result);
    });
  }

  private addressDecode(address: Geocoder): void {
    this.geocoderService.addressDecode(address, (result: Geocoder) => {
      if (result) {
        this.setNewSingleMarker([result.lat, result.lon]);
        this.addressSelect.emit(result);
      } else {
        this.addressSelect.emit(null);
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
    this.singleMarker.on('dragend', (event: Layer.LeafletMouseEvent) => {
      this.setMapLocation(event.target['_latlng']);
    });
    this.map.addLayer(this.singleMarker);
    this.map.flyTo(coords);
  }

  /**
   * This method remove existed marker and set the new marke to the map
   * @param coords - type [number, number]
   */
  private setWorkshopMarkers(address: Address): void {
    const coords: [number, number] = [address.latitude, address.longitude];
    const marker = this.createMarker(coords, false);
    this.map.addLayer(marker);
    this.workshopMarkers.push({ marker, isSelected: false });

    marker.on('click', (event: Layer.LeafletMouseEvent) => {
      this.unselectMarkers();
      const targetMarker = this.workshopMarkers.find(
        (workshopMarker: WorkshopMarker) => workshopMarker.marker === event.target
      );
      targetMarker.isSelected = true;
      targetMarker.marker.setIcon(this.selectedMarkerIcon);
      this.selectedWorkshopAddress.emit(address);
    });
  }

  /**
   * This method unselect target Marker
   */
  private unselectMarkers(): void {
    const selectedWorkshopMarker = this.workshopMarkers.filter((workshopMarker: WorkshopMarker) => workshopMarker.isSelected);
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
   */
  private createMarker(coords: [number, number], draggable = true): Layer.Marker {
    return new Layer.Marker(coords, {
      draggable,
      icon: this.unselectedMarkerIcon,
      riseOnHover: true,
      zIndexOffset: 3
    });
  }

  /**
   * This method create user marker and radius
   */
  private createUserRadius(): void {
    this.clearUserRadius();
    this.subscribeOnUserRadiusSize();

    this.userMarker = new Layer.Marker(this.defaultCoords, {
      draggable: true,
      icon: this.userIcon,
      riseOnHover: true,
      zIndexOffset: 10
    }).addTo(this.map);

    this.userRadius = Layer.circle(this.defaultCoords, {
      color: '#C72A21',
      fillOpacity: 0,
      radius: 5000 || this.radiusSize,
      className: 'leaflet-grab'
    }).addTo(this.map);

    this.setUserRadiusEvent();
  }

  /**
   * This method set events for draw and drop user marker
   */
  private setUserRadiusEvent(): void {
    this.userMarker.on('dragstart', () => this.userRadius.setStyle({ opacity: 0 }));

    this.userMarker.on('dragend', () => {
      this.userRadius.setStyle({
        opacity: 1
      });
      this.customCoords = this.userMarker.getLatLng();
      this.userRadius.setLatLng(this.customCoords);
      this.store.dispatch(new SetCoordsByMap(this.customCoords));
    });
  }

  private clearUserRadius() {
    if (this.userRadius && this.userMarker) {
      this.userRadius.removeFrom(this.map);
      this.userMarker.removeFrom(this.map);
    }
    this.workshopMarkers && this.workshopMarkers.forEach(({ marker }) => marker.removeFrom(this.map));
  }

  private subscribeOnUserRadiusSize(): void {
    this.userRadiusSize$.pipe(takeUntil(this.destroy$)).subscribe((value: number) => {
      this.radiusSize && this.updateUserRadius(value);
      this.radiusSize = value;
    });
  }

  private updateUserRadius(num: number): void {
    this.userRadius.setRadius(num);
  }

  private showWarningMessage(message: SnackbarText, type: string, infinityDuration: boolean): void {
    this.store.dispatch(
      new ShowMessageBar({ message, type, infinityDuration })
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
