import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, startWith, takeUntil, tap } from 'rxjs/operators';
import { Constants } from 'src/app/shared/constants/constants';
import { Codeficator } from 'src/app/shared/models/codeficator.model';
import { SetFocusOnCityField } from 'src/app/shared/store/app.actions';
import { FilterState } from 'src/app/shared/store/filter.state';
import { ClearCodeficatorSearch, GetCodeficatorSearch } from 'src/app/shared/store/meta-data.actions';
import { MetaDataState } from 'src/app/shared/store/meta-data.state';
import { ConfirmCity, SetCity } from '../../../store/filter.actions';

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

  settlementSearchControl = new FormControl('');
  isDispalyed = true;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.settlementListener();
    this.settlement$
      .pipe(
        takeUntil(this.destroy$),
        filter((settlement: Codeficator) => !!settlement)
      )
      .subscribe((settlement: Codeficator) => {
        this.settlement = settlement;
        this.settlementSearchControl.setValue(settlement.settlement, { emitEvent: false });
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
    this.store.dispatch(new SetCity(event.option.value));
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
    this.store.dispatch(new ConfirmCity(true));
  }

  changeCity(): void {
    this.store.dispatch([new ConfirmCity(false), new SetFocusOnCityField()]);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
