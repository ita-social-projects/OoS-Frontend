import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Constants, CropperConfigurationConstants } from '../../../../../shared/constants/constants';
import { ValidationConstants } from '../../../../../shared/constants/validation';
import { WorkshopTypeUkr } from '../../../../../shared/enum/enumUA/provider';
import { PayRateTypeEnum } from '../../../../../shared/enum/enumUA/workshop';
import { WorkshopType, OwnershipTypeName, ProviderWorkshopSameValues } from '../../../../../shared/enum/provider';
import { PayRateType } from '../../../../../shared/enum/workshop';
import { Provider } from '../../../../../shared/models/provider.model';
import { Workshop } from '../../../../../shared/models/workshop.model';

@Component({
  selector: 'app-create-about-form',
  templateUrl: './create-about-form.component.html',
  styleUrls: ['./create-about-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateAboutFormComponent implements OnInit, OnDestroy {
  readonly validationConstants = ValidationConstants;
  readonly workshopType = WorkshopType;
  readonly workshopTypeUkr = WorkshopTypeUkr;
  readonly phonePrefix = Constants.PHONE_PREFIX;
  readonly MIN_SEATS = Constants.WORKSHOP_MIN_SEATS;
  readonly UNLIMITED_SEATS = Constants.WORKSHOP_UNLIMITED_SEATS;
  readonly mailFormPlaceholder = Constants.MAIL_FORMAT_PLACEHOLDER;
  readonly PayRateType = PayRateType;
  readonly PayRateTypeUkr = PayRateType;
  readonly ownershipTypeName = OwnershipTypeName;
  readonly cropperConfig = {
    cropperMinWidth: CropperConfigurationConstants.cropperMinWidth,
    cropperMaxWidth: CropperConfigurationConstants.cropperMaxWidth,
    cropperMinHeight: CropperConfigurationConstants.cropperMinHeight,
    cropperMaxHeight: CropperConfigurationConstants.cropperMaxHeight,
    cropperAspectRatio: CropperConfigurationConstants.coverImageCropperAspectRatio,
    croppedHeight: CropperConfigurationConstants.croppedCoverImage.height,
    croppedFormat: CropperConfigurationConstants.croppedFormat,
    croppedQuality: CropperConfigurationConstants.croppedQuality
  };

  @Input() workshop: Workshop;
  @Input() provider: Provider;
  @Input() isRelease3: boolean;
  @Output() PassAboutFormGroup = new EventEmitter();

  AboutFormGroup: FormGroup;
  workingHoursFormArray: FormArray = new FormArray([], [Validators.required]);
  destroy$: Subject<boolean> = new Subject<boolean>();

  priceRadioBtn: FormControl = new FormControl(false);
  useProviderInfoCtrl: FormControl = new FormControl(false);
  availableSeatsRadioBtnControl: FormControl = new FormControl(true);

  // competitiveSelectionRadioBtn: FormControl = new FormControl(false); TODO: add to the second release

  constructor(private formBuilder: FormBuilder, private store: Store) {}

  ngOnInit(): void {
    this.initForm();
    this.PassAboutFormGroup.emit(this.AboutFormGroup);
    this.workshop && this.activateEditMode();
    this.initListeners();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  get priceControl(): FormControl {
    return this.AboutFormGroup.get('price') as FormControl;
  }

  get payRateControl(): FormControl {
    return this.AboutFormGroup.get('payRate') as FormControl;
  }

  get availableSeatsControl(): FormControl {
    return this.AboutFormGroup.get('availableSeats') as FormControl;
  }

  private get availableSeats(): number {
    return this.workshop?.availableSeats === this.UNLIMITED_SEATS ? this.MIN_SEATS : this.workshop?.availableSeats;
  }

  private get workshopPrice(): number {
    return this.workshop?.price ? this.workshop.price : ValidationConstants.MIN_PRICE;
  }

  private initForm(): void {
    this.AboutFormGroup = this.formBuilder.group({
      title: new FormControl('', [
        Validators.required,
        Validators.minLength(ValidationConstants.INPUT_LENGTH_1),
        Validators.maxLength(ValidationConstants.INPUT_LENGTH_60)
      ]),
      phone: new FormControl('', [Validators.required, Validators.minLength(ValidationConstants.PHONE_LENGTH)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      minAge: new FormControl('', [Validators.required]),
      maxAge: new FormControl('', [Validators.required]),
      image: new FormControl(''),
      website: new FormControl('', [Validators.maxLength(ValidationConstants.INPUT_LENGTH_256)]),
      facebook: new FormControl('', [Validators.maxLength(ValidationConstants.INPUT_LENGTH_256)]),
      instagram: new FormControl('', [Validators.maxLength(ValidationConstants.INPUT_LENGTH_256)]),
      price: new FormControl({ value: 0, disabled: true }, [Validators.required]),
      workingHours: this.workingHoursFormArray,
      payRate: new FormControl({ value: null, disabled: true }, [Validators.required]),
      coverImage: new FormControl(''),
      coverImageId: new FormControl(''),
      availableSeats: new FormControl({ value: 0, disabled: true }, [Validators.required])
      // competitiveSelectionDescription: new FormControl('', Validators.required),TODO: add to the second release
    });
  }

  private initListeners(): void {
    this.useProviderInfo();
    this.availableSeatsControlListener();
    this.priceControlListener();
  }

  /**
   * This method makes input enable if radiobutton value is true and sets the value to teh formgroup
   */
  private priceControlListener(): void {
    this.priceRadioBtn.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((isPrice: boolean) => {
      if (isPrice) {
        this.setPriceControlValue(this.workshopPrice, 'enable');
        this.setPayRateControlValue(this.workshop?.payRate ? this.workshop.payRate : null, 'enable');
      } else {
        this.setPriceControlValue(null, 'disable');
        this.setPayRateControlValue(null, 'disable');
        this.payRateControl.markAsUntouched();
      }
    });
  }

  /**
   * This method add listener to availableSeats control and
   * makes formGroup input enable if radiobutton value is true
   */
  private availableSeatsControlListener(): void {
    this.availableSeatsRadioBtnControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((noLimit: boolean) => {
      if (noLimit) {
        this.setAvailableSeatsControlValue(null, 'disable');
      } else {
        this.setAvailableSeatsControlValue(this.availableSeats, 'enable');
      }
    });
  }

  /**
   * This method sets null as value for available setas when there is no limit, otherwise it sests either workshop value, or null for selecting new value
   */
  private setAvailableSeatsControlValue = (availableSeats: number = null, action: string = 'disable', emitEvent: boolean = true) => {
    this.availableSeatsControl[action]({ emitEvent });
    this.availableSeatsControl.setValue(availableSeats, { emitEvent });
  };

  private setPriceControlValue = (price: number = null, action: string = 'disable', emitEvent: boolean = true) => {
    this.priceControl[action]({ emitEvent });
    this.priceControl.setValue(price, { emitEvent });
  };

  /**
   * This method sets null as value for payRate when the price is null, otherwise it sests either workshop value, or null for selecting new value
   */
  private setPayRateControlValue = (payRate: string = null, action: string = 'disable', emitEvent: boolean = true) => {
    this.payRateControl[action]({ emitEvent });
    this.payRateControl.setValue(payRate, { emitEvent });
  };

  /**
   * This method fills in the info from provider to the workshop if check box is checked
   */
  private useProviderInfo(): void {
    const setValue = (value) => this.AboutFormGroup.get(value).setValue(this.provider[ProviderWorkshopSameValues[value]]);
    const resetValue = (value) => this.AboutFormGroup.get(value).reset();

    this.useProviderInfoCtrl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((useProviderInfo: boolean) => {
      // eslint-disable-next-line guard-for-in
      for (const value in ProviderWorkshopSameValues) {
        useProviderInfo ? setValue(value) : resetValue(value);
      }
    });
  }

  /**
   * This method fills inputs with information of edited workshop
   */
  private activateEditMode(): void {
    this.AboutFormGroup.patchValue(this.workshop, { emitEvent: false });
    if (this.workshop.coverImageId) {
      this.AboutFormGroup.get('coverImageId').setValue([this.workshop.coverImageId], { emitEvent: false });
    }
    if (this.workshop.price) {
      this.setPriceControlValue(this.workshop.price, 'enable', false);
      this.setPayRateControlValue(this.workshop.payRate, 'enable', false);
      this.priceRadioBtn.setValue(true);
    } else {
      this.setPriceControlValue(null, 'disable', false);
      this.setPayRateControlValue(null, 'disable', false);
    }

    if (this.workshop.availableSeats === this.UNLIMITED_SEATS) {
      this.setAvailableSeatsControlValue(null, 'disable', false);
    } else {
      this.setAvailableSeatsControlValue(this.availableSeats, 'enable', false);
      this.availableSeatsRadioBtnControl.setValue(false);
    }
  }

  /**
   * This method makes input enable if radiobutton value
   * is true and sets the value to teh formgroup TODO: add to the second release
   */
  // private onCompetitiveSelectionCtrlInit(): void {
  //   this.competitiveSelectionRadioBtn.valueChanges
  //     .pipe(
  //       takeUntil(this.destroy$),
  //     ).subscribe((iscompetitiveSelectionDesc: boolean) => {
  //       iscompetitiveSelectionDesc ? this.AboutFormGroup.get('competitiveSelectionDescription').enable() : this.AboutFormGroup.get('competitiveSelectionDescription').disable();
  //     });

  //   this.AboutFormGroup.get('competitiveSelectionDescription').valueChanges
  //     .pipe(
  //       takeUntil(this.destroy$),
  //       debounceTime(100),
  //     ).subscribe((disabilityOptionsDesc: string) =>
  //       this.AboutFormGroup.get('competitiveSelectionDescription').setValue(disabilityOptionsDesc)
  //     );
  // }
}
