import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Constants, CropperConfigurationConstants } from 'shared/constants/constants';
import { MUST_CONTAIN_LETTERS } from 'shared/constants/regex-constants';
import { FormValidators, ValidationConstants } from 'shared/constants/validation';
import { TypeOfCompetition } from 'shared/enum/Competition';
import { TypeOfCompetitionEnum } from 'shared/enum/enumUA/competition';
import { InfoMenuType } from 'shared/enum/info-menu-type';
import { OwnershipTypes, ProviderWorkshopSameValues } from 'shared/enum/provider';
import { Competition } from 'shared/models/competition.model';
import { Provider } from 'shared/models/provider.model';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-create-required-form',
  templateUrl: './create-required-form.component.html',
  styleUrls: ['./create-required-form.component.scss']
})
export class CreateRequiredFormComponent implements OnInit, OnDestroy {
  @Input() public competition: Competition;
  @Input() public parentCompetition: string;
  @Input() public provider: Provider;
  @Input() public isImagesFeature: boolean;
  @Output() public PassRequiredFormGroup = new EventEmitter();

  public readonly validationConstants = ValidationConstants;
  public readonly MIN_SEATS = Constants.MIN_SEATS;
  public readonly UNLIMITED_SEATS = Constants.UNLIMITED_SEATS;
  public readonly TypeOfCompetitionEnum = TypeOfCompetitionEnum;
  public readonly mailFormPlaceholder = Constants.MAIL_FORMAT_PLACEHOLDER;

  protected minDate: Date = new Date(new Date().setMonth(new Date().getMonth() - 1));
  protected maxDate: Date = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
  protected readonly TypeOfCompetition = TypeOfCompetition;
  protected readonly InfoMenuType = InfoMenuType;
  protected readonly ownershipType = OwnershipTypes;

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
  public RequiredFormGroup: FormGroup;
  public isShowHintAboutCompetitionAutoClosing: boolean = false;
  public availableSeatsRadioBtnControl: FormControl = new FormControl(true);
  public useProviderInfoCtrl: FormControl = new FormControl(false);
  public filteredTypeOfCompetition: { key: string; value: string }[] = [];

  private destroy$: Subject<boolean> = new Subject<boolean>();
  private minimumSeats: number = 1;

  constructor(private formBuilder: FormBuilder) {}

  public get availableSeatsControl(): FormControl {
    return this.RequiredFormGroup.get('availableSeats') as FormControl;
  }

  public get typeOfCompetitionControl(): FormControl {
    return this.RequiredFormGroup.get('typeOfCompetition') as FormControl;
  }

  public get minSeats(): number {
    if (this.competition?.takenSeats === 0 || !this.competition) {
      return this.minimumSeats;
    }
    return this.competition?.takenSeats;
  }

  private get availableSeats(): number {
    return this.competition?.availableSeats === undefined || this.competition?.availableSeats === this.UNLIMITED_SEATS
      ? this.MIN_SEATS
      : this.competition?.availableSeats;
  }

  private filterTypeOfCompetition(stage?: boolean): void {
    this.filteredTypeOfCompetition = Object.entries(TypeOfCompetition)
      .filter(([key]) => stage || key !== 'CompetitionStage')
      .map(([key, value]) => ({ key, value }));
  }

  public ngOnInit(): void {
    this.initForm();
    this.PassRequiredFormGroup.emit(this.RequiredFormGroup);

    this.filterTypeOfCompetition(Boolean(this.parentCompetition));

    if (this.competition) {
      this.activateEditMode();
    }
    if (this.parentCompetition) {
      this.typeOfCompetitionControl.setValue(TypeOfCompetition.CompetitionStage);
      this.typeOfCompetitionControl.disable();
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
    if (!this.RequiredFormGroup.dirty) {
      this.RequiredFormGroup.markAsDirty({ onlySelf: true });
    }
  }

  public sortTime(): number {
    return 0;
  }

  /**
   * This method fills inputs with information of edited workshop
   */
  public activateEditMode(): void {
    this.RequiredFormGroup.patchValue(this.competition, { emitEvent: false });
    if (this.competition.startDate) {
      this.minDate = new Date(new Date(this.competition.startDate).setMonth(new Date(this.competition.startDate).getMonth() - 1));
    }

    if (this.competition.startDate && this.competition.endDate) {
      this.RequiredFormGroup.get('competitionDateRangeGroup')?.patchValue({
        start: this.competition.startDate,
        end: this.competition.endDate
      });

      this.RequiredFormGroup.get('competitionDateRangeGroup')?.get('start')?.markAsTouched();
      this.RequiredFormGroup.get('competitionDateRangeGroup')?.get('end')?.markAsTouched();
    }

    if (this.competition.regStartDate && this.competition.regEndDate) {
      this.RequiredFormGroup.get('registrationDateRangeGroup')?.patchValue({
        start: this.competition.regStartDate,
        end: this.competition.regEndDate
      });

      this.RequiredFormGroup.get('registrationDateRangeGroup')?.get('start')?.markAsTouched();
      this.RequiredFormGroup.get('registrationDateRangeGroup')?.get('end')?.markAsTouched();
    }

    if (this.competition.availableSeats === this.UNLIMITED_SEATS) {
      this.setAvailableSeatsControlValue(null, 'disable', false);
    } else {
      this.setAvailableSeatsControlValue(this.availableSeats, 'enable', false);
      this.availableSeatsRadioBtnControl.setValue(false);
    }
  }

  private initForm(): void {
    this.RequiredFormGroup = this.formBuilder.group({
      image: new FormControl(''),
      coverImage: new FormControl(''),
      coverImageId: new FormControl(''),
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
      phone: new FormControl('', [Validators.required, Validators.minLength(ValidationConstants.PHONE_LENGTH)]),
      email: new FormControl('', [Validators.required, FormValidators.email]),
      website: new FormControl('', [Validators.maxLength(ValidationConstants.INPUT_LENGTH_256)]),
      facebook: new FormControl('', [Validators.maxLength(ValidationConstants.INPUT_LENGTH_256)]),
      instagram: new FormControl('', [Validators.maxLength(ValidationConstants.INPUT_LENGTH_256)]),
      competitionDateRangeGroup: this.formBuilder.group({
        start: new FormControl<Date | null>(null, Validators.required),
        end: new FormControl<Date | null>(null, Validators.required)
      }),
      registrationDateRangeGroup: this.formBuilder.group({
        start: new FormControl<Date | null>(null),
        end: new FormControl<Date | null>(null)
      }),
      typeOfCompetition: new FormControl<TypeOfCompetition | null>(null, Validators.required),
      parentCompetitionControl: new FormControl(null),
      availableSeats: new FormControl({ value: null, disabled: true }, [Validators.required, Validators.min(this.minSeats)])
    });
  }

  private initListeners(): void {
    this.useProviderInfo();
    this.availableSeatsControlListener();
    this.showHintAboutClosingCompetition();
  }

  /**
   * This method fills in the info from provider to the workshop if check box is checked
   */
  private useProviderInfo(): void {
    const setValue = (value: string): void => this.RequiredFormGroup.get(value).setValue(this.provider[ProviderWorkshopSameValues[value]]);
    const resetValue = (value: string): void => this.RequiredFormGroup.get(value).reset();

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

  private showHintAboutClosingCompetition(): void {
    this.RequiredFormGroup.controls.availableSeats.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((availableSeats: number) => {
      if (availableSeats) {
        this.isShowHintAboutCompetitionAutoClosing = availableSeats === this.competition?.takenSeats;
      }
    });
  }
}
