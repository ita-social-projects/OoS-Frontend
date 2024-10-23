import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  MatLegacyAutocomplete as MatAutocomplete,
  MatLegacyAutocompleteSelectedEvent as MatAutocompleteSelectedEvent
} from '@angular/material/legacy-autocomplete';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { debounceTime, delayWhen, distinctUntilChanged, filter, takeUntil, tap } from 'rxjs/operators';

import { Constants } from 'shared/constants/constants';
import { ValidationConstants } from 'shared/constants/validation';
import { Address } from 'shared/models/address.model';
import { Codeficator } from 'shared/models/codeficator.model';
import { ClearCodeficatorSearch, GetCodeficatorSearch } from 'shared/store/meta-data.actions';
import { MetaDataState } from 'shared/store/meta-data.state';

@Component({
  selector: 'app-create-address-form',
  templateUrl: './create-address-form.component.html',
  styleUrls: ['./create-address-form.component.scss']
})
export class CreateAddressFormComponent implements OnInit {
  @ViewChild(MatAutocomplete)
  public autocomplete: MatAutocomplete;

  @Input()
  public addressFormGroup: FormGroup;
  @Input()
  public searchFormGroup: FormGroup;
  @Input()
  public address: Address;

  @Select(MetaDataState.codeficatorSearch)
  public codeficatorSearch$: Observable<Codeficator[]>;

  public readonly ValidationConstants = ValidationConstants;
  public readonly Constants = Constants;

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
  }

  /**
   * This method handle displayed value for mat-autocomplete dropdown
   * @param codeficator: Codeficator | string
   */
  public displaySettlementNameFn(codeficator: Codeficator | string): string {
    return typeof codeficator === 'string' ? codeficator : codeficator?.settlement;
  }

  /**
   * This method listen input FocusOut event and update search and settlement controls value
   */
  public onFocusOut(): void {
    const codeficator: Codeficator = this.autocomplete.options.first?.value;

    if (
      !this.settlementSearchFormControl.value ||
      codeficator?.settlement === Constants.NO_SETTLEMENT ||
      this.settlementSearchFormControl.invalid
    ) {
      this.settlementSearchFormControl.setValue(null);
      this.codeficatorIdFormControl.setValue(null);
      this.settlementFormControl.setValue(null);
    } else if (!this.autocomplete.isOpen) {
      this.settlementSearchFormControl.setValue(this.settlementFormControl.value.settlement, { emitEvent: false });
    }
  }

  /**
   * This method listen mat option select event and save settlement control value
   * @param event MatAutocompleteSelectedEvent
   */
  public onSelectSettlement(event: MatAutocompleteSelectedEvent): void {
    this.settlementSearchFormControl.setValue(event.option.value.settlement, { emitEvent: false });
    this.settlementFormControl.setValue(event.option.value, { emitEvent: false });

    this.codeficatorIdFormControl.reset();
    this.codeficatorIdFormControl.setValue(event.option.value.id);

    this.addressFormGroup.patchValue({
      latitude: event.option.value.latitude,
      longitude: event.option.value.longitude
    });

    if (!this.addressFormGroup.dirty) {
      this.addressFormGroup.markAsDirty({ onlySelf: true });
    }
  }

  private activateEditMode(): void {
    if (this.address) {
      this.addressFormGroup.patchValue({ ...this.address }, { emitEvent: false, onlySelf: true });
      this.settlementSearchFormControl.patchValue(this.address.codeficatorAddressDto.settlement, { emitEvent: false, onlySelf: true });
      this.settlementFormControl.patchValue(this.address.codeficatorAddressDto, { emitEvent: false, onlySelf: true });
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
            this.streetFormControl.setValue('', { emitEvent: false });
            this.buildingNumberFormControl.setValue('', { emitEvent: false });
          }
        }),
        filter((value: string) => value?.length > 2 && this.settlementSearchFormControl.valid),
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
}
