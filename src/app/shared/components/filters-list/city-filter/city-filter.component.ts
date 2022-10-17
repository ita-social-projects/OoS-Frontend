import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Actions, ofActionCompleted, Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, startWith, takeUntil, tap } from 'rxjs/operators';
import { Coords } from '../../../../shared/models/coords.model';
import { GeolocationService } from '../../../../shared/services/geolocation/geolocation.service';
import { Constants } from '../../../constants/constants';
import { Codeficator } from '../../../models/codeficator.model';
import { ConfirmCity, SetCity } from '../../../store/filter.actions';
import { FilterState } from '../../../store/filter.state';
import { ClearCodeficatorSearch, GetCodeficatorSearch } from '../../../store/meta-data.actions';
import { MetaDataState } from '../../../store/meta-data.state';

@Component({
  selector: 'app-city-filter',
  templateUrl: './city-filter.component.html',
  styleUrls: ['./city-filter.component.scss'],
})
export class CityFilterComponent implements OnInit, OnDestroy {
  readonly Constants = Constants;

  @Select(FilterState.isConfirmCity)
    isConfirmCity$: Observable<boolean>;
  @Select(FilterState.settlement)
    settlement$: Observable<Codeficator>;
  settlement: Codeficator;
  @Select(MetaDataState.codeficatorSearch)
    codeficatorSearch$: Observable<Codeficator[]>;
  
  @ViewChild('searchInput') searchInput: ElementRef;

  settlementSearchControl = new FormControl('');
  isDispalyed = true;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private store: Store, private actions$: Actions, private geolocationService: GeolocationService) {}

  ngOnInit(): void {
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

    this.settlementListener();
    this.settlement$
      .pipe(
        takeUntil(this.destroy$),
        filter((settlement: Codeficator) => !!settlement)
      )
      .subscribe((settlement: Codeficator) => {
        this.settlement = settlement;
        this.settlementSearchControl.setValue(settlement.settlement, { emitEvent: true });
      });
  }

  /**
   * This method listen input changes and handle search
   */
  private settlementListener(): void {
    this.settlementSearchControl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(500),
        distinctUntilChanged(),
        startWith(''),
        tap((value: string) => {
          if (!value?.length) {
            this.store.dispatch(new ClearCodeficatorSearch());
          }
        }),
        filter((value: string) => value?.length > 2)
      )
      .subscribe((value: string) => {
        this.store.dispatch(new GetCodeficatorSearch(value));
      });
  }

  onSelectedCity(event: MatAutocompleteSelectedEvent): void {
    this.geolocationService.confirmCity(event.option.value, true);
  }

  /**
   * This method listen input FocusOut event and update search and settlement controls value
   * @param auto MatAutocomplete
   */
  onFocusOut(auto: MatAutocomplete): void {
    const codeficator: Codeficator = auto.options.first?.value;
    if (codeficator?.settlement === Constants.NO_SETTLEMENT) {
      this.settlementSearchControl.setValue(null, { emitEvent: false, onlySelf: true });
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
    if (this.settlement != Constants.KYIV) {
      this.geolocationService.confirmCity(Constants.KYIV, false);
      this.actions$.pipe(ofActionCompleted(GetCodeficatorSearch)).subscribe(() => {this.setInputFocus();});
      return;
    }
    
    this.setInputFocus();
  }

  setInputFocus(): void {
    this.searchInput.nativeElement.focus();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
