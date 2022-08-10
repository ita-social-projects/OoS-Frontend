import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { Select, Store } from '@ngxs/store';
import { merge, Observable, Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  startWith,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { Constants } from 'src/app/shared/constants/constants';
import { ValidationConstants } from 'src/app/shared/constants/validation';
import { Address } from 'src/app/shared/models/address.model';
import { Codeficator } from 'src/app/shared/models/codeficator.model';
import {
  ClearCodeficatorSearch,
  GetCodeficatorSearch,
} from 'src/app/shared/store/meta-data.actions';
import { MetaDataState } from 'src/app/shared/store/meta-data.state';

@Component({
  selector: 'app-create-address-form',
  templateUrl: './create-address-form.component.html',
  styleUrls: ['./create-address-form.component.scss'],
})
export class CreateAddressFormComponent implements OnInit {
  readonly ValidationConstants = ValidationConstants;
  readonly Constants = Constants;

  @Input() addressFormGroup: FormGroup;
  @Input() searchFormGroup: FormGroup;
  @Input() address: Address;

  destroy$: Subject<boolean> = new Subject<boolean>();
  @Select(MetaDataState.codeficatorSearch) codeficatorSearch$: Observable<
    Codeficator[]
  >;

  constructor(private store: Store) {}

  get settlementFormControl(): FormControl {
    return this.searchFormGroup.get('settlement') as FormControl;
  }

  get settlementSearchFormControl(): FormControl {
    return this.searchFormGroup.get('settlementSearch') as FormControl;
  }

  get codeficatorIdFormControl(): FormControl {
    return this.addressFormGroup.get('catottgId') as FormControl;
  }

  get streetFormControl(): FormControl {
    return this.addressFormGroup.get('street') as FormControl;
  }

  get buildingNumberFormControl(): FormControl {
    return this.addressFormGroup.get('buildingNumber') as FormControl;
  }

  ngOnInit(): void {
    this.initSettlementListener();
    this.activateEditMode();
  }

  private activateEditMode(): void {
    if (this.address) {
      this.addressFormGroup.patchValue(this.address, { emitEvent: false });
      this.settlementSearchFormControl.patchValue(
        this.address.codeficatorAddressDto.settlement,
        {
          emitEvent: false,
          onlySelf: true,
        }
      );
    }
  }

  /**
   * This method handle displayed value for mat-autocomplete dropdown
   * @param codeficator: Codeficator | string
   */
  displaySettlementNameFn(codeficator: Codeficator | string): string {
    return typeof codeficator === 'string'
      ? codeficator
      : codeficator?.settlement;
  }

  /**
   * This method listen mat option select event and save settlement control value
   * @param event MatAutocompleteSelectedEvent
   * @param controls
   *  searchControl FormControl
   *  settlementControl FormControl
   *  codeficatorIdControl FormControl
   */
  onSelectSettlement(
    event: MatAutocompleteSelectedEvent,
    controls: {
      searchControl: FormControl;
      settlementControl: FormControl;
      codeficatorIdControl: FormControl;
    }
  ): void {
    this.store.dispatch(new ClearCodeficatorSearch());
    controls.searchControl.setValue(event.option.value.settlement, {
      emitEvent: false,
      onlySelf: true,
    });
    controls.settlementControl.setValue(event.option.value, {
      emitEvent: false,
      onlySelf: true,
    });

    controls.codeficatorIdControl.reset();
    controls.codeficatorIdControl.setValue(event.option.value.id);
  }

  /**
   * This method listen input FocusOut event and update search and settlement controls value
   * @param auto MatAutocomplete
   * @param controls
   *  searchControl FormControl
   *  settlementControl FormControl
   *  codeficatorIdControl FormControl
   */
  onFocusOut(
    auto: MatAutocomplete,
    controls: {
      searchControl: FormControl;
      settlementControl: FormControl;
      codeficatorIdControl: FormControl;
    }
  ): void {
    const codeficator: Codeficator = auto.options.first?.value;
    if (
      !controls.searchControl.value ||
      codeficator?.settlement === Constants.NO_SETTLEMENT
    ) {
      controls.searchControl.setValue(null);
      controls.codeficatorIdControl.setValue(null);
    } else {
      controls.searchControl.setValue(
        controls.settlementControl.value?.settlement
      );
    }
  }

  /**
   * This method listen input changes and handle search
   */
  private initSettlementListener(): void {
    this.settlementSearchFormControl.valueChanges.pipe(
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
      .subscribe((value: string) =>
        this.store.dispatch(new GetCodeficatorSearch(value))
      );
  }
}
