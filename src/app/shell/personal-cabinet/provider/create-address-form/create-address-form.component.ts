import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { debounceTime, delayWhen, distinctUntilChanged, filter, map, takeUntil, tap } from 'rxjs/operators';

import { Constants } from 'shared/constants/constants';
import { ValidationConstants } from 'shared/constants/validation';
import { Address } from 'shared/models/address.model';
import { Codeficator } from 'shared/models/codeficator.model';
import { ClearCodeficatorSearch, GetCodeficatorSearch } from 'shared/store/meta-data.actions';
import { MetaDataState } from 'shared/store/meta-data.state';
import { Util } from 'shared/utils/utils';

@Component({
  selector: 'app-create-address-form',
  templateUrl: './create-address-form.component.html',
  styleUrls: ['./create-address-form.component.scss']
})
export class CreateAddressFormComponent implements OnInit {
  @ViewChild(MatAutocomplete)
  public autocomplete: MatAutocomplete;

  @Input() public addressFormGroup: FormGroup;
  @Input() public searchFormGroup: FormGroup;
  @Input() public address: Address;

  @Select(MetaDataState.codeficatorSearch)
  public codeficatorSearch$: Observable<Codeficator[]>;

  public readonly ValidationConstants = ValidationConstants;
  public readonly Constants = Constants;

  private shouldReplaceQueryWithFirstOption: boolean = false;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private store: Store) {}

  public get settlementFormControl(): FormControl {
    return this.searchFormGroup.get('settlement') as FormControl;
  }

  public get settlementSearchFormControl(): FormControl {
    return this.searchFormGroup.get('settlementSearch') as FormControl;
  }

  public get codeficatorIdFormControl(): FormControl {
    return this.addressFormGroup.get('catottgId') as FormControl;
  }

  public get streetFormControl(): FormControl {
    return this.addressFormGroup.get('street') as FormControl;
  }

  public get buildingNumberFormControl(): FormControl {
    return this.addressFormGroup.get('buildingNumber') as FormControl;
  }

  public ngOnInit(): void {
    this.activateEditMode();
    this.initSettlementListener();
    this.codeficatorSearch$
      .pipe(
        filter(() => this.shouldReplaceQueryWithFirstOption),
        takeUntil(this.destroy$)
      )
      .subscribe((codeficator) => {
        const first = codeficator[0];
        if (first && first.settlement !== Constants.NO_SETTLEMENT) {
          const { fullAddress, ...prev } = this.settlementFormControl.value || {};
          this.settlementSearchFormControl.patchValue(first.settlement, { emitEvent: false });
          if (!Util.deepEqual(prev, first)) {
            this.settlementFormControl.patchValue(first, { emitEvent: false });
            this.clearStreetAndBuildingNumber();
          }
        } else {
          this.settlementSearchFormControl.patchValue(this.settlementFormControl.value.settlement, { emitEvent: false });
        }
        this.shouldReplaceQueryWithFirstOption = false;
      });
  }

  /**
   * This method handle displayed value for mat-autocomplete dropdown
   * @param codeficator
   */
  public displaySettlementNameFn(codeficator: Codeficator | string): string {
    return typeof codeficator === 'string' ? codeficator : codeficator?.settlement;
  }

  /**
   * This method listen input FocusOut event and update search and settlement controls value
   */
  public onFocusOut(): void {
    const entered = this.settlementSearchFormControl.value.trim();

    if (this.settlementSearchFormControl.valid && entered.toLowerCase() !== this.settlementFormControl.value.settlement.toLowerCase()) {
      this.shouldReplaceQueryWithFirstOption = true;
      this.store.dispatch(new GetCodeficatorSearch(entered));
      return;
    }

    if (!entered.length) {
      this.settlementSearchFormControl.patchValue(this.settlementFormControl.value.settlement, { emitEvent: false });
    }
  }

  /**
   * This method listen mat option select event and save settlement control value
   * @param event MatAutocompleteSelectedEvent
   */
  public onSelectSettlement(event: MatAutocompleteSelectedEvent): void {
    const selected = event.option.value;
    const { fullAddress, ...prev } = this.settlementFormControl.value || {};

    if (!Util.deepEqual(prev, selected)) {
      this.settlementFormControl.patchValue(selected, { emitEvent: false });

      this.codeficatorIdFormControl.reset();
      this.codeficatorIdFormControl.setValue(selected.id);

      // this.addressFormGroup.patchValue({
      //   latitude: selected.latitude,
      //   longitude: selected.longitude
      // });
      //
      // if (!this.addressFormGroup.dirty) {
      //   this.addressFormGroup.markAsDirty({ onlySelf: true });
      // }

      this.clearStreetAndBuildingNumber();
    }

    this.settlementSearchFormControl.patchValue(selected.settlement, { emitEvent: false });
  }

  private activateEditMode(): void {
    if (this.address) {
      this.addressFormGroup.patchValue({ ...this.address }, { emitEvent: false, onlySelf: true });
      this.settlementSearchFormControl.patchValue(this.address.codeficatorAddress?.settlement, {
        emitEvent: false,
        onlySelf: true
      });
      this.settlementFormControl.patchValue(this.address.codeficatorAddress, { emitEvent: false, onlySelf: true });
      this.store.dispatch(new ClearCodeficatorSearch());
    }
  }

  /**
   * This method listen input changes and handle search
   */
  private initSettlementListener(): void {
    this.settlementSearchFormControl.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        tap((value: string) => {
          if (!value?.length || this.settlementSearchFormControl.invalid) {
            this.store.dispatch(new ClearCodeficatorSearch());
          }
        }),
        filter((value: string) => value?.length > 2 && this.settlementSearchFormControl.valid),
        map((val) => val.trim()),
        delayWhen((value: string) => this.store.dispatch(new GetCodeficatorSearch(value)))
      )
      .subscribe((value: string) => {
        const options = this.autocomplete.options.filter((option) => option.value.settlement.toLowerCase() === value.toLowerCase());
        if (options.length === 1) {
          const settlement = options[0];
          settlement.select();
          this.addressFormGroup.patchValue({
            latitude: settlement.value.latitude,
            longitude: settlement.value.longitude
          });
        }
      });
  }

  private clearStreetAndBuildingNumber(): void {
    this.streetFormControl.setValue(null, { emitEvent: false });
    this.streetFormControl.markAsUntouched();
    this.buildingNumberFormControl.setValue(null, { emitEvent: false });
    this.buildingNumberFormControl.markAsUntouched();
  }
}
