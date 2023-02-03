import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Actions, ofActionCompleted, Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, takeUntil } from 'rxjs/operators';
import { FilterChange, SetCoordsByMap } from '../../../../shared/store/filter.actions';
import { Coords } from '../../../../shared/models/coords.model';
import { GeolocationService } from '../../../../shared/services/geolocation/geolocation.service';
import { Constants } from '../../../constants/constants';
import { Codeficator } from '../../../models/codeficator.model';
import { FilterState } from '../../../store/filter.state';
import { ClearCodeficatorSearch, GetCodeficatorSearch } from '../../../store/meta-data.actions';
import { MetaDataState } from '../../../store/meta-data.state';

@Component({
  selector: 'app-city-filter',
  templateUrl: './city-filter.component.html',
  styleUrls: ['./city-filter.component.scss']
})
export class CityFilterComponent implements OnInit, AfterViewInit, OnDestroy {
  readonly Constants = Constants;
  readonly sliceLength = 25;

  @Select(FilterState.isConfirmCity)
  isConfirmCity$: Observable<boolean>;
  @Select(FilterState.settlement)
  settlement$: Observable<Codeficator>;
  settlement: Codeficator;
  @Select(MetaDataState.codeficatorSearch)
  codeficatorSearch$: Observable<Codeficator[]>;
  codeficatorSearch: Codeficator[];

  @ViewChild('searchInput') searchInput: ElementRef;

  settlementSearchControl: FormControl = new FormControl('');
  isDispalyed = true;
  isTopCities = false;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private store: Store, private actions$: Actions, private geolocationService: GeolocationService) {}

  ngOnInit(): void {
    this.settlementListener();
    this.settlement$
      .pipe(
        filter((settlement: Codeficator) => settlement !== undefined),
        takeUntil(this.destroy$)
      )
      .subscribe((settlement: Codeficator) => {
        this.settlement = settlement;
        this.settlementSearchControl.setValue(settlement?.settlement, { emitEvent: true });
      });

    this.codeficatorSearch$.pipe(takeUntil(this.destroy$)).subscribe((searchResult: Codeficator[]) => {
      const controlValue = this.settlementSearchControl.value;
      if (controlValue && this.isTopCities) {
        this.codeficatorSearch = this.store
          .selectSnapshot(MetaDataState.codeficatorSearch)
          .filter((codeficator: Codeficator) => codeficator.settlement.toLowerCase().startsWith(controlValue.toLowerCase()));
      } else {
        this.codeficatorSearch = searchResult;
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.geolocationService.isCityInStorage()) {
      this.geolocationService.confirmCity(JSON.parse(localStorage.getItem('cityConfirmation')), true);
    } else {
      this.geolocationService.handleUserLocation((coords: Coords) => {
        if (coords) {
          this.geolocationService.getNearestByCoordinates(coords, (result: Codeficator) => {
            this.geolocationService.confirmCity(result, false);
          });
        } else {
          this.geolocationService.confirmCity(Constants.KYIV, false);
        }
      });
    }
  }

  /**
   * This method listen input changes and handle search
   */
  private settlementListener(): void {
    this.settlementSearchControl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((value: string) => {
        if (value?.length > 3) {
          this.store.dispatch(new GetCodeficatorSearch(value));
          this.isTopCities = false;
        } else if (!this.isTopCities) {
          this.store.dispatch(new GetCodeficatorSearch(''));
          this.isTopCities = true;
        } else {
          this.codeficatorSearch = this.store
            .selectSnapshot(MetaDataState.codeficatorSearch)
            .filter((codeficator: Codeficator) => codeficator.settlement.toLowerCase().startsWith(value.toLowerCase()));
        }
      });
  }

  onSelectedCity(event: MatAutocompleteSelectedEvent): void {
    this.geolocationService.confirmCity(event.option.value, true);
    this.store.dispatch([new SetCoordsByMap({ lat: event.option.value.latitude, lng: event.option.value.longitude }), new FilterChange()]);
  }

  /**
   * This method listen input FocusOut event and update search and settlement controls value
   * @param auto MatAutocomplete
   */
  onFocusOut(): void {
    if (!this.settlementSearchControl.value) {
      const settlement = this.store.selectSnapshot(FilterState.settlement);
      this.settlement = settlement;
      this.settlementSearchControl.setValue(settlement.settlement, { emitEvent: false });
      this.codeficatorSearch = null;
    }
  }

  /**
   * This method handle displayed value for mat-autocomplete dropdown
   * @param codeficator: Codeficator | string
   */
  displaySettlementNameFn(codeficator: Codeficator | string): string {
    return typeof codeficator === 'string' ? codeficator : codeficator?.settlement;
  }

  confirmCity(): void {
    this.geolocationService.confirmCity(this.settlement, true);
  }

  changeCity(): void {
    this.isDispalyed = false;
    this.settlementSearchControl.setValue(null);
    this.settlement = null;
    this.actions$.pipe(ofActionCompleted(GetCodeficatorSearch), takeUntil(this.destroy$)).subscribe(() => this.setInputFocus());
  }

  setInputFocus(): void {
    this.searchInput.nativeElement.focus();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
