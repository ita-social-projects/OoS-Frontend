import { CodeficatorFilter } from './../../../models/codeficator.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, startWith, takeUntil, tap } from 'rxjs/operators';
import { Constants } from 'src/app/shared/constants/constants';
import { Codeficator } from 'src/app/shared/models/codeficator.model';
import { FilterState } from 'src/app/shared/store/filter.state';
import { ClearCodeficatorSearch, GetCodeficatorSearch } from 'src/app/shared/store/meta-data.actions';
import { MetaDataState } from 'src/app/shared/store/meta-data.state';
import { SetCity } from '../../../store/filter.actions';

@Component({
  selector: 'app-city-filter',
  templateUrl: './city-filter.component.html',
  styleUrls: ['./city-filter.component.scss'],
})
export class CityFilterComponent implements OnInit, OnDestroy {
  readonly Constants = Constants;

  @Select(FilterState.isConfirmCity)
  isConfirmCity$: Observable<boolean>;
  @Select(MetaDataState.codeficatorSearch)
  codeficatorSearch$: Observable<Codeficator[]>;

  settlementSearchControl = new FormControl('');
  settlementControl = new FormControl('');

  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.settlementListener();
    this.codeficatorSearch$.subscribe(val => console.log(val));
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

  onSelectedCity(settelment: Codeficator): void {
    this.store.dispatch(
      new SetCity({
        ...settelment,
        catottgId: settelment.id,
        name: settelment.settlement,
      })
    );
  }

  /**
   * This method listen input FocusOut event and update search and settlement controls value
   * @param auto MatAutocomplete
   */
  onFocusOut(auto: MatAutocomplete): void {
    const codeficator: Codeficator = auto.options.first?.value;
    if (!this.settlementSearchControl.value || codeficator?.settlement === Constants.NO_SETTLEMENT) {
      this.settlementSearchControl.setValue(null);
    } else {
      this.settlementSearchControl.setValue(this.settlementControl.value?.settlement);
    }
  }

  /**
   * This method listen mat option select event and save settlement control value
   * @param event MatAutocompleteSelectedEvent
   */
  onSelectSettlement(event: MatAutocompleteSelectedEvent): void {
    this.store.dispatch(new ClearCodeficatorSearch());
    this.settlementSearchControl.setValue(event.option.value.settlement, { emitEvent: false, onlySelf: true });
    this.settlementControl.setValue(event.option.value, { emitEvent: false, onlySelf: true });
  }

  /**
   * This method handle displayed value for mat-autocomplete dropdown
   * @param codeficator: Codeficator | string
   */
  displaySettlementNameFn(codeficator: Codeficator | string): string {
    return typeof codeficator === 'string' ? codeficator : codeficator?.settlement;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
