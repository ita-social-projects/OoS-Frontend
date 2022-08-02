import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatSelectChange } from '@angular/material/select';
import { Select, Store } from '@ngxs/store';
import { merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, startWith, takeUntil, tap } from 'rxjs/operators';
import { Provider } from 'src/app/shared/models/provider.model';
import { ValidationConstants } from 'src/app/shared/constants/validation';
import { NO_LATIN_REGEX } from 'src/app/shared/constants/regex-constants';
import { Constants } from 'src/app/shared/constants/constants';
import { Codeficator, CodeficatorCityDistrict } from 'src/app/shared/models/codeficator.model';
import { MetaDataState } from 'src/app/shared/store/meta-data.state';
import {
  ClearCodeficatorSearch,
  GetCodeficatorCitiDistrictSearch,
  GetCodeficatorSearch
} from 'src/app/shared/store/meta-data.actions';
import { CodeficatorCategories } from 'src/app/shared/enum/codeficator-categories';
import * as cloneDeep from 'lodash/cloneDeep';

const defaultValidators: ValidatorFn[] = [
  Validators.required,
  Validators.pattern(NO_LATIN_REGEX),
  Validators.minLength(ValidationConstants.INPUT_LENGTH_1),
  Validators.maxLength(ValidationConstants.INPUT_LENGTH_60)
];

const defaultSearchValidators: ValidatorFn[] = [
  Validators.required,
  Validators.pattern(NO_LATIN_REGEX),
  Validators.minLength(ValidationConstants.INPUT_LENGTH_3),
  Validators.maxLength(ValidationConstants.INPUT_LENGTH_60)
];

@Component({
  selector: 'app-create-contacts-form',
  templateUrl: './create-contacts-form.component.html',
  styleUrls: ['./create-contacts-form.component.scss']
})
export class CreateContactsFormComponent implements OnInit, OnDestroy {
  readonly ValidationConstants = ValidationConstants;
  readonly Constants = Constants;

  legalAddressFormGroup: FormGroup;
  actualAddressFormGroup: FormGroup;
  searchFormGroup: FormGroup;
  isSameAddressControl: FormControl = new FormControl(false);
  cityDistrictLegal: CodeficatorCityDistrict[] = [];
  cityDistrictActual: CodeficatorCityDistrict[] = [];

  destroy$: Subject<boolean> = new Subject<boolean>();
  @Select(MetaDataState.codeficatorSearch) codeficatorSearch$: Observable<Codeficator[]>;
  @Select(MetaDataState.cityDistrictSearch) cityDistrictSearch$: Observable<CodeficatorCityDistrict[]>;

  @Input() provider: Provider;
  @Output() passActualAddressFormGroup = new EventEmitter();
  @Output() passLegalAddressFormGroup = new EventEmitter();

  constructor(private store: Store) {
  }

  get searchActualFormGroup(): FormGroup {
    return this.searchFormGroup.get('actualAddress') as FormGroup;
  }

  get settlementLegalSearchFormControl(): FormControl {
    return this.searchFormGroup.get('legalAddress').get('settlementSearch') as FormControl;
  }

  get settlementActualSearchFormControl(): FormControl {
    return this.searchActualFormGroup.get('settlementSearch') as FormControl;
  }

  get settlementLegalFormControl(): FormControl {
    return this.searchFormGroup.get('legalAddress').get('settlement') as FormControl;
  }

  get settlementActualFormControl(): FormControl {
    return this.searchActualFormGroup.get('settlement') as FormControl;
  }

  get cityDistrictLegalFormControl(): FormControl {
    return this.searchFormGroup.get('legalAddress').get('cityDistrict') as FormControl;
  }

  get cityDistrictActualFormControl(): FormControl {
    return this.searchActualFormGroup.get('cityDistrict') as FormControl;
  }

  get codeficatorIdLegalFormControl(): FormControl {
    return this.legalAddressFormGroup.get('codeficatorId') as FormControl;
  }

  get codeficatorIdActualFormControl(): FormControl {
    return this.actualAddressFormGroup.get('codeficatorId') as FormControl;
  }

  get streetLegalFormControl(): FormControl {
    return this.legalAddressFormGroup.get('street') as FormControl;
  }

  get streetActualFormControl(): FormControl {
    return this.actualAddressFormGroup.get('street') as FormControl;
  }

  get buildingNumberLegalFormControl(): FormControl {
    return this.legalAddressFormGroup.get('buildingNumber') as FormControl;
  }

  get buildingNumberActualFormControl(): FormControl {
    return this.actualAddressFormGroup.get('buildingNumber') as FormControl;
  }

  get isAvailableCityDistrictLegal(): boolean {
    // TODO: wait for update from back-end and update this logic
    return this.settlementLegalFormControl.value?.category === CodeficatorCategories.City
      || this.settlementLegalFormControl.value?.category === CodeficatorCategories.SpecialStatusCity;
  }

  get isAvailableCityDistrictActual(): boolean {
    // TODO: wait for update from back-end and update this logic
    return this.settlementActualFormControl.value?.category === CodeficatorCategories.City
      || this.settlementActualFormControl.value?.category === CodeficatorCategories.SpecialStatusCity;
  }

  /**
   * This method handle Angular Lifecycle hook OnInit
   */
  ngOnInit(): void {
    this.initData();
  }

  /**
   * This method handle displayed value for mat-autocomplete dropdown
   * @param codeficator: Codeficator | string
   */
  displaySettlementNameFn(codeficator: Codeficator | string): string {
    return typeof codeficator === 'string' ? codeficator : codeficator?.settlement;
  }

  /**
   * This method listen mat option select event and save settlement control value
   * @param event MatAutocompleteSelectedEvent
   * @param controls
   *  searchControl FormControl
   *  settlementControl FormControl
   *  codeficatorIdControl FormControl
   *  cityDistrictControl FormControl
   */
  onSelectSettlement(
    event: MatAutocompleteSelectedEvent,
    controls: {
      searchControl: FormControl,
      settlementControl: FormControl,
      codeficatorIdControl: FormControl,
      cityDistrictControl: FormControl
    }
  ): void {
    this.store.dispatch(new ClearCodeficatorSearch());
    controls.searchControl.setValue(event.option.value.settlement, { emitEvent: false, onlySelf: true });
    controls.settlementControl.setValue(event.option.value, { emitEvent: false, onlySelf: true });

    controls.codeficatorIdControl.reset();
    controls.cityDistrictControl.reset();
    controls.codeficatorIdControl.setValue(event.option.value.id);

    if (controls.settlementControl.value?.category === CodeficatorCategories.City
      || controls.settlementControl.value?.category === CodeficatorCategories.SpecialStatusCity) {
      controls.codeficatorIdControl.reset();
      this.store.dispatch(new GetCodeficatorCitiDistrictSearch(event.option.value.id));
    }
  }

  /**
   * This method listen mat option select event and settlement control value
   * @param event MatSelectChange
   * @param codeficatorIdControl FormControl
   */
  onSelectCityDistrict(event: MatSelectChange, codeficatorIdControl: FormControl): void {
    this.store.dispatch(new ClearCodeficatorSearch());
    codeficatorIdControl.reset();
    codeficatorIdControl.setValue(event.value);
  }

  /**
   * This method listen input FocusOut event and update search and settlement controls value
   * @param auto MatAutocomplete
   * @param searchControl FormControl
   * @param settlementControl FormControl
   * @param codeficatorIdControl FormControl
   */
  onFocusOut(
    auto: MatAutocomplete,
    searchControl: FormControl,
    settlementControl: FormControl,
    codeficatorIdControl: FormControl
  ): void {
    const codeficator: Codeficator = auto.options.first?.value;
    if (!searchControl.value || codeficator?.settlement === Constants.NO_SETTLEMENT) {
      searchControl.setValue(null);
      codeficatorIdControl.setValue(null);
    } else {
      searchControl.setValue(settlementControl.value?.settlement);
    }
  }

  /**
   * This method handle Angular Lifecycle hook OnDestroy
   */
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  /**
   * This method for init all needed data
   */
  private initData(): void {
    this.initFormGroups();
    this.initListeners();
    if (this.provider) {
      this.activateEditMode();
    }
    this.passLegalAddressFormGroup.emit(this.legalAddressFormGroup);
    this.passActualAddressFormGroup.emit(this.actualAddressFormGroup);
  }

  /**
   * This method for init all FormGroups
   */
  private initFormGroups(): void {
    this.legalAddressFormGroup = new FormGroup({
      street: new FormControl('', defaultValidators),
      buildingNumber: new FormControl('', defaultValidators),
      codeficatorId: new FormControl('', Validators.required)
    });

    this.actualAddressFormGroup = new FormGroup({
      street: new FormControl('', defaultValidators),
      buildingNumber: new FormControl('', defaultValidators),
      codeficatorId: new FormControl('', Validators.required)
    });

    this.searchFormGroup = new FormGroup({
      legalAddress: new FormGroup({
        settlementSearch: new FormControl('', defaultSearchValidators),
        cityDistrict: new FormControl('', defaultSearchValidators),
        settlement: new FormControl('')
      }),
      actualAddress: new FormGroup({
        settlementSearch: new FormControl('', defaultSearchValidators),
        cityDistrict: new FormControl('', defaultSearchValidators),
        settlement: new FormControl('')
      })
    });
  }

  /**
   * This method for adding listeners
   */
  private initListeners(): void {
    this.settlementListener();
    this.sameAddressListener();
    this.cityDistrictListener();
  }

  /**
   * This method listen input changes and handle search
   */
  private settlementListener(): void {
    merge(
      this.settlementLegalSearchFormControl.valueChanges,
      this.settlementActualSearchFormControl.valueChanges
    )
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
      .subscribe((value: string) => this.store.dispatch(new GetCodeficatorSearch(value)));
  }

  /**
   * This method makes input enable if radiobutton value is true and sets the value to the formGroup
   */
  private sameAddressListener(): void {
    this.isSameAddressControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((isSame: boolean) => this.handleSameAddress(isSame));
  }

  /**
   * This method listen cityDistrictSearch observable and fill mat selects
   */
  private cityDistrictListener(): void {
    this.cityDistrictSearch$
      .pipe(takeUntil(this.destroy$))
      .subscribe((list: CodeficatorCityDistrict[]) => {
        if (!this.isSameAddressControl.value && this.settlementActualFormControl.value) {
          this.cityDistrictActual = cloneDeep(list);
        } else {
          this.cityDistrictLegal = cloneDeep(list);
        }
      });
  }

  /**
   * This method handle edit state for the formGroup
   */
  private activateEditMode(): void {
    const legalAddress = this.provider?.legalAddress;
    const actualAddress = this.provider?.actualAddress;
    const legalCodeficatorAddress = legalAddress?.codeficatorAddressDto;
    const actualCodeficatorAddress = actualAddress?.codeficatorAddressDto;

    // Setup Legal Address form controls
    this.legalAddressFormGroup.patchValue(legalAddress, { emitEvent: false });
    this.settlementLegalSearchFormControl.patchValue(
      legalCodeficatorAddress.settlement,
      { emitEvent: false, onlySelf: true }
    );
    this.settlementLegalFormControl.patchValue(
      legalCodeficatorAddress,
      { emitEvent: false, onlySelf: true }
    );

    if (this.isAvailableCityDistrictLegal) {
      this.store.dispatch(new GetCodeficatorCitiDistrictSearch(legalCodeficatorAddress.id));
    }

    // Setup Actual Address form controls
    if (actualAddress) {
      this.actualAddressFormGroup.patchValue(actualAddress, { emitEvent: false });
      this.settlementActualSearchFormControl.patchValue(
        actualCodeficatorAddress.settlement, { emitEvent: false, onlySelf: true }
      );
      this.settlementActualFormControl.patchValue(
        actualCodeficatorAddress, { emitEvent: false, onlySelf: true }
      );
    }

    this.isSameAddressControl.setValue(!Boolean(this.provider.actualAddress));
  }

  /**
   * This method makes the formGroup enabled and and validators
   * @param control AbstractControl
   */
  private enableControl(control: AbstractControl): void {
    control.enable();
    control.markAsUntouched();
  }

  /**
   * This method makes the formGroup disabled and clear validators
   * @param control AbstractControl
   */
  private disableControl(control: AbstractControl): void {
    control.reset();
    control.disable();
    control.clearValidators();
  }

  /**
   * This method add validators to the form-group
   * @param control AbstractControl
   * @param validators ValidatorFn | ValidatorFn[]
   */
  private setValidators(control: AbstractControl, validators: ValidatorFn | ValidatorFn[]): void {
    if ((control as FormGroup).controls) {
      Object.keys((control as FormGroup).controls).forEach((formControlTitle: string) => {
        control.get(formControlTitle).setValidators(validators);
        control.updateValueAndValidity();
      });
    } else {
      control.setValidators(validators);
      control.updateValueAndValidity();
    }
  }

  /**
   * This method for handle same address value
   * @param isSame boolean
   */
  private handleSameAddress(isSame: boolean): void {
    if (isSame) {
      this.disableControl(this.actualAddressFormGroup);
      this.disableControl(this.searchActualFormGroup);
    } else {
      this.enableControl(this.actualAddressFormGroup);
      this.enableControl(this.searchActualFormGroup);

      const controlsConfigList: { control: AbstractControl, validators: ValidatorFn | ValidatorFn[] }[] = [
        { control: this.streetActualFormControl, validators: defaultValidators },
        { control: this.buildingNumberActualFormControl, validators: defaultValidators },
        { control: this.codeficatorIdActualFormControl, validators: Validators.required },
        { control: this.settlementActualSearchFormControl, validators: defaultSearchValidators },
        { control: this.cityDistrictActualFormControl, validators: defaultSearchValidators }
      ];
      controlsConfigList.forEach((config: { control: AbstractControl, validators: ValidatorFn | ValidatorFn[] }) => {
        this.setValidators(config.control, config.validators);
      });

      if (this.provider?.actualAddress) {
        this.codeficatorIdActualFormControl.setValue(this.provider.actualAddress.codeficatorId);
      }
    }
  }
}
