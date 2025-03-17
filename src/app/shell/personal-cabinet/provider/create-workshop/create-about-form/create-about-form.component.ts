import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { distinctUntilChanged, map, takeUntil } from 'rxjs/operators';

import { Constants, CropperConfigurationConstants } from 'shared/constants/constants';
import { ValidationConstants } from 'shared/constants/validation';
import { FormOfLearningEnum, PayRateTypeEnum } from 'shared/enum/enumUA/workshop';
import { OwnershipTypes, ProviderWorkshopSameValues } from 'shared/enum/provider';
import { FormOfLearning, PayRateType } from 'shared/enum/workshop';
import { Provider } from 'shared/models/provider.model';
import { Workshop } from 'shared/models/workshop.model';
import { Util } from 'shared/utils/utils';
import { InfoMenuType } from 'shared/enum/info-menu-type';
import { MUST_CONTAIN_LETTERS } from 'shared/constants/regex-constants';
import { AgeRangeValidator } from 'shared/validators/age-range-validator';

@Component({
  selector: 'app-create-about-form',
  templateUrl: './create-about-form.component.html',
  styleUrls: ['./create-about-form.component.scss']
})
export class CreateAboutFormComponent implements OnInit, OnDestroy {
  @Input() public workshop: Workshop;
  @Input() public provider: Provider;
  @Input() public isImagesFeature: boolean;
  @Output() public PassAboutFormGroup = new EventEmitter();

  public readonly validationConstants = ValidationConstants;
  public readonly MIN_SEATS = Constants.MIN_SEATS;
  public readonly UNLIMITED_SEATS = Constants.UNLIMITED_SEATS;
  public readonly mailFormPlaceholder = Constants.MAIL_FORMAT_PLACEHOLDER;
  public readonly PayRateType = PayRateType;
  public readonly PayRateTypeEnum = PayRateTypeEnum;
  public readonly FormOfLearning = FormOfLearning;
  public readonly FormOfLearningEnum = FormOfLearningEnum;
  public readonly ownershipType = OwnershipTypes;
  public readonly Util = Util;
  public readonly cropperConfig = {
    cropperMinWidth: CropperConfigurationConstants.cropperMinWidth,
    cropperMaxWidth: CropperConfigurationConstants.cropperMaxWidth,
    cropperMinHeight: CropperConfigurationConstants.cropperMinHeight,
    cropperMaxHeight: CropperConfigurationConstants.cropperMaxHeight,
    cropperAspectRatio: CropperConfigurationConstants.coverImageCropperAspectRatio,
    croppedHeight: CropperConfigurationConstants.croppedCoverImage.height,
    croppedFormat: CropperConfigurationConstants.croppedFormat,
    croppedQuality: CropperConfigurationConstants.croppedQuality
  };
  public readonly InfoMenuType = InfoMenuType;

  public AboutFormGroup: FormGroup;
  public dateTimeRangesArray: FormArray = new FormArray([], [Validators.required]);
  public priceRadioBtn: FormControl = new FormControl(false);
  public useProviderInfoCtrl: FormControl = new FormControl(false);
  public availableSeatsRadioBtnControl: FormControl = new FormControl(true);
  public competitiveSelectionRadioBtn: FormControl = new FormControl(false);
  public isShowHintAboutWorkshopAutoClosing: boolean = false;
  private destroy$: Subject<boolean> = new Subject<boolean>();
  private competitiveSelectionDescriptionFormControl: FormControl = new FormControl('', [
    Validators.required,
    Validators.pattern(MUST_CONTAIN_LETTERS)
  ]);
  private minimumSeats: number = 1;

  constructor(private readonly formBuilder: FormBuilder) {}

  public get priceControl(): FormControl {
    return this.AboutFormGroup.get('price') as FormControl;
  }

  public get payRateControl(): FormControl {
    return this.AboutFormGroup.get('payRate') as FormControl;
  }

  public get availableSeatsControl(): FormControl {
    return this.AboutFormGroup.get('availableSeats') as FormControl;
  }

  public get minSeats(): number {
    if (this.workshop?.takenSeats === 0 || !this.workshop) {
      return this.minimumSeats;
    }
    return this.workshop?.takenSeats;
  }

  private get availableSeats(): number {
    return this.workshop?.availableSeats === undefined || this.workshop?.availableSeats === this.UNLIMITED_SEATS
      ? this.MIN_SEATS
      : this.workshop?.availableSeats;
  }

  private get workshopPrice(): number {
    return this.workshop?.price ? this.workshop.price : null;
  }

  public ngOnInit(): void {
    this.initForm();
    this.PassAboutFormGroup.emit(this.AboutFormGroup);

    if (this.workshop) {
      this.activateEditMode();
    }

    this.initListeners();
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  /**
   * This method makes AboutFormGroup dirty
   */
  public markFormAsDirtyOnUserInteraction(): void {
    if (!this.AboutFormGroup.dirty) {
      this.AboutFormGroup.markAsDirty({ onlySelf: true });
    }
  }

  /**
   * This method fills inputs with information of edited workshop
   */
  public activateEditMode(): void {
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
      this.setPayRateControlValue(PayRateType.None, 'disable', false);
    }

    if (this.workshop.availableSeats === this.UNLIMITED_SEATS) {
      this.setAvailableSeatsControlValue(null, 'disable', false);
    } else {
      this.setAvailableSeatsControlValue(this.availableSeats, 'enable', false);
      this.availableSeatsRadioBtnControl.setValue(false);
    }

    this.competitiveSelectionRadioBtn.setValue(this.workshop.competitiveSelection);
    this.competitiveSelectionDescriptionFormControl = new FormControl(this.workshop.competitiveSelectionDescription, [
      Validators.pattern(MUST_CONTAIN_LETTERS),
      Validators.required
    ]);
    if (this.workshop.competitiveSelection) {
      this.AboutFormGroup.setControl('competitiveSelectionDescription', this.competitiveSelectionDescriptionFormControl);
    }
  }

  private initForm(): void {
    this.AboutFormGroup = this.formBuilder.group(
      {
        title: new FormControl('', [
          Validators.required,
          Validators.minLength(ValidationConstants.INPUT_LENGTH_1),
          Validators.maxLength(ValidationConstants.INPUT_LENGTH_60),
          Validators.pattern(MUST_CONTAIN_LETTERS)
        ]),
        shortTitle: new FormControl('', [
          Validators.maxLength(ValidationConstants.INPUT_LENGTH_60),
          Validators.required,
          Validators.pattern(MUST_CONTAIN_LETTERS),
          Validators.minLength(ValidationConstants.INPUT_LENGTH_1)
        ]),
        minAge: new FormControl(null, [
          Validators.required,
          Validators.max(ValidationConstants.BIRTH_AGE_MAX),
          Validators.min(ValidationConstants.AGE_MIN)
        ]),
        maxAge: new FormControl(null, [
          Validators.required,
          Validators.max(ValidationConstants.BIRTH_AGE_MAX),
          Validators.min(ValidationConstants.AGE_MIN)
        ]),
        image: new FormControl(''),
        price: new FormControl({ value: 0, disabled: true }, [
          Validators.required,
          Validators.min(ValidationConstants.MIN_PRICE),
          Validators.max(ValidationConstants.MAX_PRICE)
        ]),
        dateTimeRanges: this.dateTimeRangesArray,
        formOfLearning: new FormControl(FormOfLearning.Offline, [Validators.required]),
        payRate: new FormControl({ value: PayRateType.None, disabled: true }, [Validators.required]),
        coverImage: new FormControl(''),
        coverImageId: new FormControl(''),
        availableSeats: new FormControl(
          {
            value: null,
            disabled: true
          },
          [Validators.required, Validators.min(this.minSeats), Validators.max(ValidationConstants.MAX_SEATS)]
        ),
        competitiveSelection: new FormControl(false),
        competitiveSelectionDescription: null
      },
      {
        validators: [AgeRangeValidator('minAge', 'maxAge')]
      }
    );
  }

  private initListeners(): void {
    this.useProviderInfo();
    this.availableSeatsControlListener();
    this.validateAgeControls();
    this.priceControlListener();
    this.priceValueListener();
    this.competitiveSelectionListener();
    this.showHintAboutClosingWorkshop();
  }

  /**
   * This method makes input enable if radiobutton value is true and sets the value to the FormGroup
   */
  private priceControlListener(): void {
    this.priceRadioBtn.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((isPrice: boolean) => {
      this.markFormAsDirtyOnUserInteraction();
      if (isPrice) {
        this.setPriceControlValue(this.workshopPrice, 'enable');
        this.setPayRateControlValue(this.workshop?.payRate || null, 'enable');
      } else {
        this.setPriceControlValue();
        this.setPayRateControlValue();
      }
      this.priceControl.markAsUntouched();
      this.payRateControl.markAsUntouched();
    });
  }

  private priceValueListener(): void {
    this.priceControl.valueChanges.pipe(takeUntil(this.destroy$), distinctUntilChanged()).subscribe((value) => {
      if (value) {
        this.payRateControl.markAsTouched();
      } else {
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
      this.markFormAsDirtyOnUserInteraction();
      if (noLimit) {
        this.setAvailableSeatsControlValue(null, 'disable');
      } else {
        this.setAvailableSeatsControlValue(this.availableSeats, 'enable');
      }
    });
  }

  /**
   * This method sets null as value for available set as when there is no limit,
   * otherwise it sets either workshop value, or null for selecting new value
   */
  private setAvailableSeatsControlValue(availableSeats: number = null, action: string = 'disable', emitEvent: boolean = true): void {
    this.availableSeatsControl[action]({ emitEvent });
    this.availableSeatsControl.setValue(availableSeats, { emitEvent });
  }

  private setPriceControlValue(price: number = null, action: string = 'disable', emitEvent: boolean = false): void {
    this.priceControl[action]({ emitEvent });
    this.priceControl.setValue(price, { emitEvent });
  }

  /**
   * This method sets 0 as value for payRate when the price is 0,
   * otherwise it sets either workshop value, or PayRateType.None for selecting new value
   */
  private setPayRateControlValue(payRate: PayRateType = PayRateType.None, action: string = 'disable', emitEvent: boolean = false): void {
    this.payRateControl[action]({ emitEvent });
    this.payRateControl.setValue(payRate, { emitEvent });
  }

  /**
   * This method fills in the info from provider to the workshop if check box is checked
   */
  private useProviderInfo(): void {
    const setValue = (value: string): void => this.AboutFormGroup.get(value).setValue(this.provider[ProviderWorkshopSameValues[value]]);
    const resetValue = (value: string): void => this.AboutFormGroup.get(value).reset();

    this.useProviderInfoCtrl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((useProviderInfo: boolean) => {
      // eslint-disable-next-line guard-for-in
      for (const value in ProviderWorkshopSameValues) {
        if (useProviderInfo) {
          setValue(value);
        } else {
          resetValue(value);
        }
      }
    });
  }

  /**
   * This method makes input enable if radiobutton value
   * is true and sets the value to the FormGroup
   */
  private competitiveSelectionListener(): void {
    this.competitiveSelectionRadioBtn.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((isCompetitiveSelectionDesc: boolean) => {
      this.markFormAsDirtyOnUserInteraction();
      this.AboutFormGroup.get('competitiveSelection').setValue(isCompetitiveSelectionDesc);

      if (isCompetitiveSelectionDesc) {
        this.AboutFormGroup.setControl('competitiveSelectionDescription', this.competitiveSelectionDescriptionFormControl);
      } else {
        this.AboutFormGroup.removeControl('competitiveSelectionDescription');
      }
    });
  }

  private validateAgeControls(): void {
    const controls = ['maxAge', 'minAge'];
    controls.forEach((controlName) => {
      const control = this.AboutFormGroup.get(controlName);
      control.valueChanges
        .pipe(
          map((value: number) => Util.formatAgeString(value)),
          takeUntil(this.destroy$)
        )
        .subscribe((value: number) => control.setValue(value, { emitEvent: false }));
    });
  }

  private showHintAboutClosingWorkshop(): void {
    this.AboutFormGroup.controls.availableSeats.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((availableSeats: number) => {
      if (availableSeats) {
        this.isShowHintAboutWorkshopAutoClosing = availableSeats === this.workshop?.takenSeats;
      }
    });
  }
}
