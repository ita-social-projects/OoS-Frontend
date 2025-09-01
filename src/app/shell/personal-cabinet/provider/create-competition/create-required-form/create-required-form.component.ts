import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';

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
import { maxArrayLength, minArrayLength } from 'shared/validators/array-length/array-length-validator';
import { FieldsListenerComponent } from '../../../shared-cabinet/create-form/fields-listener.component';

@Component({
  selector: 'app-create-required-form',
  templateUrl: './create-required-form.component.html',
  styleUrls: ['./create-required-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateRequiredFormComponent extends FieldsListenerComponent implements OnInit, OnDestroy {
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

  protected minDate: Date = new Date(new Date().setMonth(new Date().getMonth() - 12));
  protected maxDate: Date = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
  protected readonly validationConstants = ValidationConstants;
  protected readonly InfoMenuType = InfoMenuType;
  protected readonly ownershipType = OwnershipTypes;
  protected readonly fieldsToListen = ['coverImage', 'title', 'shortTitle'];

  private readonly minimumSeats: number = 1;

  constructor(
    protected readonly store: Store,
    protected readonly translateService: TranslateService,
    private readonly formBuilder: FormBuilder,
    private readonly route: ActivatedRoute
  ) {
    super(store, translateService);
  }

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

  private get coverImageControl(): FormControl {
    return this.RequiredFormGroup.get('coverImage') as FormControl;
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

    if (!this.route.snapshot.paramMap.has('entity')) {
      this.listenToChanges(this.RequiredFormGroup);
    }

    this.coverImageControl.clearValidators();
  }

  public onDeleteImage(): void {
    if (this.competition) {
      this.coverImageControl.addValidators([Validators.required, minArrayLength(1), maxArrayLength(1)]);
      this.coverImageControl.markAsTouched();
      this.coverImageControl.updateValueAndValidity();
    }
  }

  private initForm(): void {
    this.RequiredFormGroup = this.formBuilder.group(
      {
        image: new FormControl(''),
        coverImage: new FormControl('', [Validators.required, minArrayLength(1), maxArrayLength(1)]),
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
          start: new FormControl<Date | null>(null),
          end: new FormControl<Date | null>(null)
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
