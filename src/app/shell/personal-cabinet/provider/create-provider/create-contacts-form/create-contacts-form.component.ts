import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, UntypedFormControl, UntypedFormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormValidators } from 'src/app/shared/constants/validation';
import { Provider } from 'src/app/shared/models/provider.model';

@Component({
  selector: 'app-create-contacts-form',
  templateUrl: './create-contacts-form.component.html',
  styleUrls: ['./create-contacts-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateContactsFormComponent implements OnInit, OnDestroy {
  legalAddressFormGroup: UntypedFormGroup;
  actualAddressFormGroup: UntypedFormGroup;
  searchFormGroup: UntypedFormGroup;
  isSameAddressControl: UntypedFormControl = new UntypedFormControl(false);

  destroy$: Subject<boolean> = new Subject<boolean>();

  @Input() provider: Provider;
  @Output() passActualAddressFormGroup = new EventEmitter();
  @Output() passLegalAddressFormGroup = new EventEmitter();

  constructor() {}

  get searchActualFormGroup(): UntypedFormGroup {
    return this.searchFormGroup.get('actualAddress') as UntypedFormGroup;
  }

  get searchLegalFormGroup(): UntypedFormGroup {
    return this.searchFormGroup.get('legalAddress') as UntypedFormGroup;
  }

  get settlementLegalSearchFormControl(): UntypedFormControl {
    return this.searchFormGroup.get('legalAddress').get('settlementSearch') as UntypedFormControl;
  }

  get settlementLegalFormControl(): UntypedFormControl {
    return this.searchFormGroup.get('legalAddress').get('settlement') as UntypedFormControl;
  }

  get settlementActualSearchFormControl(): UntypedFormControl {
    return this.searchActualFormGroup.get('settlementSearch') as UntypedFormControl;
  }

  get settlementActualFormControl(): UntypedFormControl {
    return this.searchActualFormGroup.get('settlement') as UntypedFormControl;
  }

  get codeficatorIdActualFormControl(): UntypedFormControl {
    return this.actualAddressFormGroup.get('catottgId') as UntypedFormControl;
  }

  get streetActualFormControl(): UntypedFormControl {
    return this.actualAddressFormGroup.get('street') as UntypedFormControl;
  }

  get buildingNumberActualFormControl(): UntypedFormControl {
    return this.actualAddressFormGroup.get('buildingNumber') as UntypedFormControl;
  }

  /**
   * This method handle Angular Lifecycle hook OnInit
   */
  ngOnInit(): void {
    this.initData();
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
    this.legalAddressFormGroup = new UntypedFormGroup({
      street: new UntypedFormControl('', FormValidators.defaultAddressValidators),
      buildingNumber: new UntypedFormControl('', FormValidators.defaultAddressValidators),
      catottgId: new UntypedFormControl('', Validators.required),
    });

    this.actualAddressFormGroup = new UntypedFormGroup({
      street: new UntypedFormControl('', FormValidators.defaultAddressValidators),
      buildingNumber: new UntypedFormControl('', FormValidators.defaultAddressValidators),
      catottgId: new UntypedFormControl('', Validators.required),
    });

    this.searchFormGroup = new UntypedFormGroup({
      legalAddress: new UntypedFormGroup({
        settlementSearch: new UntypedFormControl('', FormValidators.defaultSearchValidators),
        settlement: new UntypedFormControl(''),
      }),
      actualAddress: new UntypedFormGroup({
        settlementSearch: new UntypedFormControl('', FormValidators.defaultSearchValidators),
        settlement: new UntypedFormControl(''),
      }),
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
    this.isSameAddressControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((isSame: boolean) => this.handleSameAddress(isSame));
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
      onlySelf: true,
    });
    this.settlementLegalFormControl.patchValue(legalCodeficatorAddress, { emitEvent: false, onlySelf: true });

    // Setup Actual Address form controls
    if (actualAddress) {
      this.actualAddressFormGroup.patchValue(actualAddress, { emitEvent: false });
      this.settlementActualSearchFormControl.patchValue(actualCodeficatorAddress.settlement, {
        emitEvent: false,
        onlySelf: true,
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
    if ((control as UntypedFormGroup).controls) {
      Object.keys((control as UntypedFormGroup).controls).forEach((formControlTitle: string) => {
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
        { control: this.streetActualFormControl, validators: FormValidators.defaultAddressValidators },
        { control: this.buildingNumberActualFormControl, validators: FormValidators.defaultAddressValidators },
        { control: this.codeficatorIdActualFormControl, validators: Validators.required },
        { control: this.settlementActualSearchFormControl, validators: FormValidators.defaultSearchValidators },
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
