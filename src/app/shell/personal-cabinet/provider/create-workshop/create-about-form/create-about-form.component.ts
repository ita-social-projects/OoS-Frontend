import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { merge, Subject, throttleTime } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

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
import { Store } from '@ngxs/store';
import { ShowMessageBar } from 'shared/store/app.actions';
import { TranslateService } from '@ngx-translate/core';

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
  public useProviderInfoCtrl: FormControl = new FormControl(false);
  public availableSeatsRadioBtnControl: FormControl = new FormControl(true);
  public isShowHintAboutWorkshopAutoClosing: boolean = false;
  private destroy$: Subject<boolean> = new Subject<boolean>();
  private minimumSeats: number = 1;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly store: Store,
    private readonly translateService: TranslateService
  ) {}

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

  public ngOnInit(): void {
    this.initForm();
    this.PassAboutFormGroup.emit(this.AboutFormGroup);

    if (this.workshop) {
      this.activateEditMode();
      this.listenToChanges();
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

    if (this.workshop.availableSeats === this.UNLIMITED_SEATS) {
      this.setAvailableSeatsControlValue(null, 'disable', false);
    } else {
      this.setAvailableSeatsControlValue(this.availableSeats, 'enable', false);
      this.availableSeatsRadioBtnControl.setValue(false);
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
        dateTimeRanges: this.dateTimeRangesArray,
        formOfLearning: new FormControl(FormOfLearning.Offline, [Validators.required]),
        coverImage: new FormControl(''),
        coverImageId: new FormControl(''),
        availableSeats: new FormControl(
          {
            value: null,
            disabled: true
          },
          [Validators.required, Validators.min(this.minSeats), Validators.max(ValidationConstants.MAX_SEATS)]
        )
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
    this.showHintAboutClosingWorkshop();
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

  private listenToChanges(): void {
    merge(
      this.AboutFormGroup.get('coverImage').valueChanges,
      this.AboutFormGroup.get('title').valueChanges.pipe(
        throttleTime(5000, undefined, {
          leading: true,
          trailing: false
        })
      ),
      this.AboutFormGroup.get('shortTitle').valueChanges.pipe(
        throttleTime(5000, undefined, {
          leading: true,
          trailing: false
        })
      )
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.store.dispatch(
          new ShowMessageBar({
            message: this.translateService.instant('SERVICE_MESSAGES.SNACK_BAR_TEXT.CHANGE_REQUIRES_MODERATION'),
            type: 'warningYellow'
          })
        );
      });
  }
}
