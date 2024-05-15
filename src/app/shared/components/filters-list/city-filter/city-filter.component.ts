import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  MatLegacyAutocomplete as MatAutocomplete,
  MatLegacyAutocompleteSelectedEvent as MatAutocompleteSelectedEvent
} from '@angular/material/legacy-autocomplete';
import { Actions, Select, Store, ofActionCompleted } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, takeUntil } from 'rxjs/operators';
import { MAT_TOOLTIP_DEFAULT_OPTIONS } from '@angular/material/tooltip';
import { CustomMatTooltipDefaultOptions } from 'shared/constants/constants';
import { Constants } from 'shared/constants/constants';
import { Codeficator } from 'shared/models/codeficator.model';
import { Coords } from 'shared/models/coords.model';
import { GeolocationService } from 'shared/services/geolocation/geolocation.service';
import { FilterChange, SetCoordsByMap } from 'shared/store/filter.actions';
import { FilterState } from 'shared/store/filter.state';
import { GetCodeficatorSearch } from 'shared/store/meta-data.actions';
import { MetaDataState } from 'shared/store/meta-data.state';

@Component({
  selector: 'app-city-filter',
  templateUrl: './city-filter.component.html',
  styleUrls: ['./city-filter.component.scss'],
  providers: [{ provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: CustomMatTooltipDefaultOptions }]
})
export class CityFilterComponent implements OnInit, OnDestroy {
  @Select(FilterState.isConfirmCity)
  public isConfirmCity$: Observable<boolean>;
  @Select(FilterState.settlement)
  private settlement$: Observable<Codeficator>;
  @Select(MetaDataState.codeficatorSearch)
  private codeficatorSearch$: Observable<Codeficator[]>;

  @ViewChild(MatAutocomplete) private codeficatorAutocomplete: MatAutocomplete;
  @ViewChild('searchInput') private searchInput: ElementRef;

  public readonly Constants = Constants;
  public readonly sliceLength = 25;

  public settlement: Codeficator;
  public codeficatorSearch: Codeficator[];
  public settlementSearchControl: FormControl = new FormControl('');
  public isDisplayed = true;

  private isTopCities = false;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private store: Store,
    private actions$: Actions,
    private geolocationService: GeolocationService
  ) {}

  public ngOnInit(): void {
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

    this.setCurrentGeolocation();
  }

  public onSelectedCity(event: MatAutocompleteSelectedEvent): void {
    this.geolocationService.confirmCity(event.option.value, true);
    this.store.dispatch([new SetCoordsByMap({ lat: event.option.value.latitude, lng: event.option.value.longitude }), new FilterChange()]);
  }

  public onFocusOut(event: FocusEvent): void {
    if (!event.relatedTarget || !this.codeficatorAutocomplete.panel.nativeElement.contains(event.relatedTarget)) {
      this.settlementSearchControl.setValue(this.settlement.settlement);
    }
  }

  public displaySettlementNameFn(codeficator: Codeficator | string): string {
    return typeof codeficator === 'string' ? codeficator : codeficator?.settlement;
  }

  public confirmCity(): void {
    this.geolocationService.confirmCity(this.settlement, true);
    this.store.dispatch(new FilterChange());
  }

  public changeCity(): void {
    this.isDisplayed = false;
    this.settlementSearchControl.setValue(null);
    this.settlement = null;
    this.actions$.pipe(ofActionCompleted(GetCodeficatorSearch), takeUntil(this.destroy$)).subscribe(() => this.setInputFocus());
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  private setInputFocus(): void {
    this.searchInput.nativeElement.focus();
  }

  /**
   * This method listen input changes and handle search
   */
  private settlementListener(): void {
    this.settlementSearchControl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((value: string) => {
        if (value?.length >= 3) {
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

  private setCurrentGeolocation(): void {
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
}
