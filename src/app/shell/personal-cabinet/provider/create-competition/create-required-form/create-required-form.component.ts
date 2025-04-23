import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Constants } from 'shared/constants/constants';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { Constants } from 'shared/constants/constants';
import { MUST_CONTAIN_LETTERS } from 'shared/constants/regex-constants';
import { ValidationConstants } from 'shared/constants/validation';
import { TypeOfCompetition } from 'shared/enum/competition';
import { TypeOfCompetitionEnum } from 'shared/enum/enumUA/competition';
import { InfoMenuType } from 'shared/enum/info-menu-type';
import { OwnershipTypes } from 'shared/enum/provider';
import { Competition } from 'shared/models/competition.model';
import { Provider } from 'shared/models/provider.model';
import { CopperConfig } from 'shared/configs/copper.config';
import { AgeRangeValidator } from 'shared/validators/age-range-validator';

@Component({
  selector: 'app-create-required-form',
  templateUrl: './create-required-form.component.html',
  styleUrls: ['./create-required-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateRequiredFormComponent implements OnInit, OnDestroy {
  @Input() public competition: Competition;
  @Input() public parentCompetition: string;
  @Input() public provider: Provider;
  @Input() public isImagesFeature: boolean;
  @Output() public PassRequiredFormGroup = new EventEmitter();

  public readonly ValidationConstants = ValidationConstants;
  public readonly Constants = Constants;
  public readonly UNLIMITED_SEATS = Constants.UNLIMITED_SEATS;
  public readonly TypeOfCompetitionEnum = TypeOfCompetitionEnum;

  public readonly cropperConfig = CopperConfig;
  public RequiredFormGroup: FormGroup;
  public isShowHintAboutCompetitionAutoClosing: boolean = false;
  public availableSeatsRadioBtnControl: FormControl = new FormControl(true);
  public useProviderInfoCtrl: FormControl = new FormControl(false);
  public filteredTypeOfCompetition: { key: string; value: string }[] = [];

  protected minDate: Date = new Date(new Date().setMonth(new Date().getMonth()));
  protected maxDate: Date = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
  protected readonly validationConstants = ValidationConstants;
  protected readonly TypeOfCompetition = TypeOfCompetition;
  protected readonly InfoMenuType = InfoMenuType;
  protected readonly ownershipType = OwnershipTypes;

  private readonly destroy$: Subject<boolean> = new Subject<boolean>();
  private readonly minimumSeats: number = 1;

  constructor(private readonly formBuilder: FormBuilder) {}

  public get availableSeatsControl(): FormControl {
    return this.RequiredFormGroup.get('numberOfSeats') as FormControl;
  }

  public get competitiveEventAccountingTypeIdControl(): FormControl {
    return this.RequiredFormGroup.get('competitiveEventAccountingTypeId') as FormControl;
  }

  public get minSeats(): number {
    if (this.competition?.numberOfOccupiedSeats === 0 || !this.competition) {
      return this.minimumSeats;
    }
    return this.competition?.numberOfOccupiedSeats;
  }

  private get availableSeats(): number {
    return this.competition?.numberOfSeats === undefined || this.competition?.numberOfSeats === Constants.UNLIMITED_SEATS
      ? this.Constants.MIN_SEATS
      : this.competition?.numberOfSeats;
  }

  public ngOnInit(): void {
    this.initForm();
    this.PassRequiredFormGroup.emit(this.RequiredFormGroup);

    this.filterTypeOfCompetition(Boolean(this.parentCompetition));

    if (this.competition) {
      this.activateEditMode();
    }
    if (this.parentCompetition) {
      this.competitiveEventAccountingTypeIdControl.setValue(TypeOfCompetition.CompetitionStage);
      this.competitiveEventAccountingTypeIdControl.disable();
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

  /**
   * This method fills inputs with information of edited workshop
   */
  public activateEditMode(): void {
    this.RequiredFormGroup.patchValue(this.competition, { emitEvent: false });
    if (this.competition.scheduledStartTime) {
      this.minDate = new Date(
        new Date(this.competition.scheduledStartTime).setMonth(new Date(this.competition.scheduledStartTime).getMonth() - 1)
      );
    }

    if (this.competition.scheduledStartTime && this.competition.scheduledEndTime) {
      this.RequiredFormGroup.get('competitionDateRangeGroup')?.patchValue({
        start: this.competition.scheduledStartTime,
        end: this.competition.scheduledEndTime
      });

      this.RequiredFormGroup.get('competitionDateRangeGroup')?.get('start')?.markAsTouched();
      this.RequiredFormGroup.get('competitionDateRangeGroup')?.get('end')?.markAsTouched();
    }

    if (this.competition.registrationStartTime && this.competition.registrationEndTime) {
      this.RequiredFormGroup.get('registrationDateRangeGroup')?.patchValue({
        start: this.competition.registrationStartTime,
        end: this.competition.registrationEndTime
      });

      this.RequiredFormGroup.get('registrationDateRangeGroup')?.get('start')?.markAsTouched();
      this.RequiredFormGroup.get('registrationDateRangeGroup')?.get('end')?.markAsTouched();
    }

    if (this.competition.competitiveEventAccountingTypeId) {
      this.competitiveEventAccountingTypeIdControl.setValue(String(this.competition.competitiveEventAccountingTypeId), {
        emitEvent: false
      });
    }

    if (this.competition.numberOfSeats === this.Constants.UNLIMITED_SEATS) {
      this.setAvailableSeatsControlValue(null, 'disable', false);
    } else {
      this.setAvailableSeatsControlValue(this.availableSeats, 'enable', false);
      this.availableSeatsRadioBtnControl.setValue(false);
    }
  }

  private initForm(): void {
    this.RequiredFormGroup = this.formBuilder.group(
      {
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
        competitionDateRangeGroup: this.formBuilder.group({
          start: new FormControl<Date | null>(null, Validators.required),
          end: new FormControl<Date | null>(null, Validators.required)
        }),
        minimumAge: new FormControl(null, [
          Validators.required,
          Validators.max(ValidationConstants.BIRTH_AGE_MAX),
          Validators.min(ValidationConstants.AGE_MIN)
        ]),
        maximumAge: new FormControl(null, [
          Validators.required,
          Validators.max(ValidationConstants.BIRTH_AGE_MAX),
          Validators.min(ValidationConstants.AGE_MIN)
        ]),
        registrationDateRangeGroup: this.formBuilder.group({
          start: new FormControl<Date | null>(null, Validators.required),
          end: new FormControl<Date | null>(null, Validators.required)
        }),
        competitiveEventAccountingTypeId: new FormControl<number | null>(null, Validators.required),
        parentCompetitionControl: new FormControl(null),
        numberOfSeats: new FormControl({ value: null, disabled: true }, [
          Validators.required,
          Validators.min(this.minSeats),
          Validators.max(ValidationConstants.MAX_SEATS)
        ])
      },
      {
        validators: [AgeRangeValidator('minimumAge', 'maximumAge')]
      }
    );
  }

  private initListeners(): void {
    this.availableSeatsControlListener();
    this.showHintAboutClosingCompetition();
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
    this.RequiredFormGroup.controls.numberOfSeats.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((availableSeats: number) => {
      if (availableSeats) {
        this.isShowHintAboutCompetitionAutoClosing = availableSeats === this.competition?.numberOfOccupiedSeats;
      }
    });
  }

  private filterTypeOfCompetition(stage?: boolean): void {
    this.filteredTypeOfCompetition = Object.entries(TypeOfCompetition)
      .filter(([key, value]) => !isNaN(Number(key)) && (stage || value !== 'CompetitionStage'))
      .map(([key, value]) => ({ key, value: value as string }));
  }
}
