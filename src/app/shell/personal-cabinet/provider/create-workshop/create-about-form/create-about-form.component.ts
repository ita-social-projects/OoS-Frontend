import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { TranslateService } from '@ngx-translate/core';
import { Select, Store } from '@ngxs/store';
import { merge, Observable, of, Subject, throttleTime } from 'rxjs';
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
import { ShowMessageBar } from 'shared/store/app.actions';
import { ActivatedRoute } from '@angular/router';
import { formatToClientDate } from 'shared/utils/provider.utils';
import { LOCAL_STUDY_PERIOD_DATE_FORMATS } from 'shared/configs/study-period-dates.config';
import { ValidationMessages } from 'shared/enum/validation-messages';
import { MetaDataState } from 'shared/store/meta-data.state';
import { LanguageListItem } from 'shared/models/language-list.model';
import { GetLanguageList } from 'shared/store/meta-data.actions';
import { maxArrayLength, minArrayLength } from 'shared/validators/array-length/array-length-validator';
import { ImageControlValidator } from 'shared/validators/image-control-validator';
import { base64ToFile } from 'ngx-image-cropper';

@Component({
  selector: 'app-create-about-form',
  templateUrl: './create-about-form.component.html',
  styleUrls: ['./create-about-form.component.scss'],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: LOCAL_STUDY_PERIOD_DATE_FORMATS }]
})
export class CreateAboutFormComponent implements OnInit, OnDestroy {
  @Select(MetaDataState.languageList)
  public languageList$!: Observable<LanguageListItem[]>;

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
  public coverImageControl: FormControl = new FormControl('', [Validators.required, minArrayLength(1), maxArrayLength(1)]);
  public useProviderInfoCtrl: FormControl = new FormControl(false);
  public availableSeatsRadioBtnControl: FormControl = new FormControl(true);
  public isShowHintAboutWorkshopAutoClosing: boolean = false;
  public errorMap = new Map<string, string>([[ValidationMessages.INVALID_DATE_FIELD, ValidationMessages.INVALID_STUDY_PERIOD_RANGE]]);
  private destroy$: Subject<boolean> = new Subject<boolean>();
  private minimumSeats: number = 1;
  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly store: Store,
    private readonly translateService: TranslateService,
    private readonly route: ActivatedRoute
  ) {}

  public get availableSeatsControl(): FormControl {
    return this.AboutFormGroup.get('availableSeats') as FormControl;
  }

  public get studyPeriodDates(): FormGroup {
    return this.AboutFormGroup.get('studyPeriodDates') as FormGroup;
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
    this.getLanguageList();
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

    if (this.workshop.base64CoverImage) {
      const file = base64ToFile(this.workshop.base64CoverImage);
      this.AboutFormGroup.get('coverImage')?.setValue([file]);
    }

    if (this.workshop.coverImageId) {
      this.AboutFormGroup.get('coverImageId').setValue([this.workshop.coverImageId], { emitEvent: false });
    }

    if (this.workshop?.studyPeriodDates?.startDate && this.workshop?.studyPeriodDates?.endDate) {
      const startDateObj = formatToClientDate(this.workshop.studyPeriodDates.startDate);
      const endDateObj = formatToClientDate(this.workshop.studyPeriodDates.endDate);

      if (startDateObj !== null && endDateObj !== null) {
        this.studyPeriodDates.patchValue(
          {
            startDate: startDateObj,
            endDate: endDateObj
          },
          { emitEvent: false }
        );
      }
    }

    if (this.workshop.noAgeRestrictions) {
      this.AboutFormGroup.get('maxAge').setValue(null, { emitEvent: false });
      this.AboutFormGroup.get('minAge').setValue(null, { emitEvent: false });
    } else {
      this.AboutFormGroup.get('minAge').enable();
      this.AboutFormGroup.get('maxAge').enable();
    }

    if (this.workshop.availableSeats === this.UNLIMITED_SEATS) {
      this.setAvailableSeatsControlValue(null, 'disable', false);
    } else {
      this.setAvailableSeatsControlValue(this.availableSeats, 'enable', false);
      this.availableSeatsRadioBtnControl.setValue(false);
    }

    if (this.route.snapshot.paramMap.get('entity') === 'workshop') {
      this.listenToChanges();
    }

    this.coverImageControl.clearValidators();
  }

  public onDeleteImage(): void {
    if (this.workshop) {
      this.coverImageControl.addValidators([Validators.required, minArrayLength(1), maxArrayLength(1)]);
      this.coverImageControl.markAsTouched();
      this.coverImageControl.updateValueAndValidity();
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
        noAgeRestrictions: new FormControl(true),
        minAge: new FormControl(
          {
            value: null,
            disabled: true
          },
          [Validators.required, Validators.max(ValidationConstants.BIRTH_AGE_MAX), Validators.min(ValidationConstants.AGE_MIN)]
        ),
        maxAge: new FormControl(
          {
            value: null,
            disabled: true
          },
          [Validators.required, Validators.max(ValidationConstants.BIRTH_AGE_MAX), Validators.min(ValidationConstants.AGE_MIN)]
        ),
        studyPeriodDates: this.formBuilder.group({
          startDate: new FormControl<Date | null>(null, Validators.required),
          endDate: new FormControl<Date | null>(null, Validators.required)
        }),
        image: new FormControl(''),
        dateTimeRanges: this.dateTimeRangesArray,
        languageOfEducationId: new FormControl(null, Validators.required),
        formOfLearning: new FormControl(FormOfLearning.Offline, [Validators.required]),
        coverImage: this.coverImageControl,
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
        validators: [AgeRangeValidator('minAge', 'maxAge'), ImageControlValidator('coverImage', 'coverImageId')]
      }
    );
  }

  private getLanguageList(): void {
    this.store.dispatch(new GetLanguageList());
  }

  private initListeners(): void {
    this.useProviderInfo();
    this.availableSeatsControlListener();
    this.validateAgeControls();
    this.showHintAboutClosingWorkshop();
    this.noAgeRestrictionsControlListener();
  }

  /**
   * This method add listener to availableSeats control and
   * makes formGroup input enable if radio button value is true
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
   * This method add listener to unlimitedAge control and
   * makes formGroup input disable if radio button value is true
   */
  private noAgeRestrictionsControlListener(): void {
    this.AboutFormGroup.get('noAgeRestrictions')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((noLimit: boolean) => {
        const ageFormControls = ['maxAge', 'minAge'];
        if (noLimit) {
          ageFormControls.forEach((field) => {
            const control = this.AboutFormGroup.get(field);
            control?.disable();
            control?.setValue(null, { emitEvent: false });
          });
        } else {
          ageFormControls.forEach((field) => {
            const control = this.AboutFormGroup.get(field);
            control?.enable({ emitEvent: false });
            control?.markAsUntouched();
          });
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
      ...['coverImage', 'title', 'shortTitle'].map(
        (controlName) =>
          this.AboutFormGroup.get(controlName)?.valueChanges.pipe(
            throttleTime(5000, undefined, {
              leading: true,
              trailing: false
            })
          ) ?? of()
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
