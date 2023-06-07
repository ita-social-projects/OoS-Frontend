import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';

import { FormValidators } from '../../../../../shared/constants/validation';
import { Provider } from '../../../../../shared/models/provider.model';

@Component({
  selector: 'app-create-contacts-form',
  templateUrl: './create-contacts-form.component.html',
  styleUrls: ['./create-contacts-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateContactsFormComponent implements OnInit, OnDestroy {
  @Input() public provider: Provider;
  @Output() public passActualAddressFormGroup = new EventEmitter();
  @Output() public passLegalAddressFormGroup = new EventEmitter();

  private destroy$: Subject<boolean> = new Subject<boolean>();

  public legalAddressFormGroup: FormGroup;
  public actualAddressFormGroup: FormGroup;
  public searchFormGroup: FormGroup;
  public isSameAddressControl: FormControl = new FormControl(false);

  constructor() {}

  public get searchActualFormGroup(): FormGroup {
    return this.searchFormGroup.get('actualAddress') as FormGroup;
  }

  public get searchLegalFormGroup(): FormGroup {
    return this.searchFormGroup.get('legalAddress') as FormGroup;
  }

  public get settlementLegalSearchFormControl(): FormControl {
    return this.searchFormGroup.get('legalAddress').get('settlementSearch') as FormControl;
  }

  public get settlementLegalFormControl(): FormControl {
    return this.searchFormGroup.get('legalAddress').get('settlement') as FormControl;
  }

  public get settlementActualSearchFormControl(): FormControl {
    return this.searchActualFormGroup.get('settlementSearch') as FormControl;
  }

  public get settlementActualFormControl(): FormControl {
    return this.searchActualFormGroup.get('settlement') as FormControl;
  }

  public get codeficatorIdActualFormControl(): FormControl {
    return this.actualAddressFormGroup.get('catottgId') as FormControl;
  }

  public get streetActualFormControl(): FormControl {
    return this.actualAddressFormGroup.get('street') as FormControl;
  }

  public get buildingNumberActualFormControl(): FormControl {
    return this.actualAddressFormGroup.get('buildingNumber') as FormControl;
  }

  /**
   * This method handle Angular Lifecycle hook OnInit
   */
  public ngOnInit(): void {
    this.initData();
  }

  /**
   * This method handle Angular Lifecycle hook OnDestroy
   */
  public ngOnDestroy(): void {
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
      street: new FormControl('', FormValidators.defaultStreetValidators),
      buildingNumber: new FormControl('', FormValidators.defaultHouseValidators),
      catottgId: new FormControl('', Validators.required)
    });

    this.actualAddressFormGroup = new FormGroup({
      street: new FormControl('', FormValidators.defaultStreetValidators),
      buildingNumber: new FormControl('', FormValidators.defaultHouseValidators),
      catottgId: new FormControl('', Validators.required)
    });

    this.searchFormGroup = new FormGroup({
      legalAddress: new FormGroup({
        settlementSearch: new FormControl('', FormValidators.defaultSearchValidators),
        settlement: new FormControl('')
      }),
      actualAddress: new FormGroup({
        settlementSearch: new FormControl('', FormValidators.defaultSearchValidators),
        settlement: new FormControl('')
      })
    });
  }

  /**
   * This method for adding listeners
   */
  private initListeners(): void {
    this.sameAddressListener();
  }

  /**
   * This method makes input enable if radiobutton value is true and sets the value to the formGroup
   */
  private sameAddressListener(): void {
    this.isSameAddressControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((isSame: boolean) => this.handleSameAddress(isSame));
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
    this.settlementLegalSearchFormControl.patchValue(legalCodeficatorAddress.settlement, {
      emitEvent: false,
      onlySelf: true
    });
    this.settlementLegalFormControl.patchValue(legalCodeficatorAddress, { emitEvent: false, onlySelf: true });

    // Setup Actual Address form controls
    if (actualAddress) {
      this.actualAddressFormGroup.patchValue(actualAddress, { emitEvent: false });
      this.settlementActualSearchFormControl.patchValue(actualCodeficatorAddress.settlement, {
        emitEvent: false,
        onlySelf: true
      });
      this.settlementActualFormControl.patchValue(actualCodeficatorAddress, { emitEvent: false, onlySelf: true });
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

      const controlsConfigList: { control: AbstractControl; validators: ValidatorFn | ValidatorFn[] }[] = [
        { control: this.streetActualFormControl, validators: FormValidators.defaultStreetValidators },
        { control: this.buildingNumberActualFormControl, validators: FormValidators.defaultHouseValidators },
        { control: this.codeficatorIdActualFormControl, validators: Validators.required },
        { control: this.settlementActualSearchFormControl, validators: FormValidators.defaultSearchValidators }
      ];
      controlsConfigList.forEach((config: { control: AbstractControl; validators: ValidatorFn | ValidatorFn[] }) => {
        this.setValidators(config.control, config.validators);
      });

      if (this.provider?.actualAddress) {
        this.codeficatorIdActualFormControl.setValue(this.provider.actualAddress.catottgId);
      }
    }
  }
}
