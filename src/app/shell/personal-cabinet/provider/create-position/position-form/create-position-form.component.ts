import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Select } from '@ngxs/store';
import { Subject, takeUntil } from 'rxjs';
import { ValidationConstants } from 'shared/constants/validation';
import { Position } from 'shared/models/position.model';
import { Provider } from 'shared/models/provider.model';
import { RegistrationState } from 'shared/store/registration.state';

@Component({
  selector: 'app-create-position-form',
  templateUrl: './create-position-form.component.html',
  styleUrls: ['./create-position-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreatePositionFormComponent implements OnInit {
  @Input() public position: Position;
  @Output() public passPositionFormGroup = new EventEmitter();
  @Select(RegistrationState.provider) public provider: Provider;

  public readonly validationConstants = ValidationConstants;

  public PositionFormGroup: FormGroup;

  private readonly destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private readonly fb: FormBuilder) {}

  public get seatsAmountControl(): FormControl {
    return this.PositionFormGroup.get('seatsAmount') as FormControl;
  }

  public ngOnInit(): void {
    this.createPositionForm();
    this.initListeners();
    if (this.position) {
      this.activateEditMode();
    }
  }

  public markFormAsDirtyOnUserInteraction(): void {
    if (!this.PositionFormGroup.dirty) {
      this.PositionFormGroup.markAsDirty({ onlySelf: true });
    }
  }

  private activateEditMode(): void {
    this.PositionFormGroup.patchValue({
      language: this.position.language,
      description: this.position.description,
      department: this.position.department,
      seatsAmount: this.position.seatsAmount,
      fullName: this.position.fullName,
      shortName: this.position.shortName,
      genitiveName: this.position.genitiveName,
      isTeachingPosition: this.position.isTeachingPosition,
      rate: this.position.rate,
      tariff: this.position.tariff,
      classifierType: this.position.classifierType,
      isForRuralAreas: this.position.isForRuralAreas,
      providerId: this.position.providerId ?? this.provider?.id
    });

    const noLimitSeats = this.position.seatsAmount === this.validationConstants.UNLIMITED_SEATS;
    this.PositionFormGroup.get('seatsAmountRadioBtnControl').setValue(noLimitSeats, { emitEvent: false });

    if (noLimitSeats) {
      this.setSeatsAmountControlValue(null, 'disable', false);
    } else {
      this.setSeatsAmountControlValue(this.position.seatsAmount, 'enable', false);
    }
  }

  private createPositionForm(): void {
    this.PositionFormGroup = this.fb.group({
      language: ['', [Validators.required, Validators.maxLength(this.validationConstants.INPUT_LENGTH_30)]],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(this.validationConstants.INPUT_LENGTH_3),
          Validators.maxLength(this.validationConstants.INPUT_LENGTH_500)
        ]
      ],
      seatsAmount: [
        { value: null, disabled: true },
        [Validators.required, Validators.min(this.validationConstants.MIN_SEATS), Validators.max(this.validationConstants.MAX_SEATS)]
      ],
      department: ['', [Validators.required, Validators.maxLength(this.validationConstants.INPUT_LENGTH_60)]],
      fullName: ['', [Validators.required, Validators.maxLength(this.validationConstants.INPUT_LENGTH_60)]],
      shortName: ['', [Validators.required, Validators.maxLength(this.validationConstants.INPUT_LENGTH_60)]],
      isTeachingPosition: [false],
      genitiveName: ['', [Validators.required, Validators.maxLength(this.validationConstants.INPUT_LENGTH_60)]],
      rate: [
        '',
        [Validators.required, Validators.min(this.validationConstants.MIN_PRICE), Validators.max(this.validationConstants.MAX_RATE)]
      ],
      tariff: [
        '',
        [Validators.required, Validators.min(this.validationConstants.MIN_PRICE), Validators.max(this.validationConstants.MAX_RATE)]
      ],
      classifierType: ['', [Validators.required, Validators.maxLength(this.validationConstants.INPUT_LENGTH_100)]],
      isForRuralAreas: [false],
      seatsAmountRadioBtnControl: [true],
      providerId: [this.provider.id]
    });
    this.passPositionFormGroup.emit(this.PositionFormGroup);
  }

  private initListeners(): void {
    this.availableSeatsControlListener();
  }

  private availableSeatsControlListener(): void {
    this.PositionFormGroup.get('seatsAmountRadioBtnControl')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((noLimit: boolean) => {
        this.markFormAsDirtyOnUserInteraction();
        if (noLimit) {
          this.setSeatsAmountControlValue(null, 'disable');
        } else {
          this.setSeatsAmountControlValue(this.validationConstants.MIN_SEATS, 'enable');
        }
      });
  }

  private setSeatsAmountControlValue(seatsAmount: number = null, action: string = 'disable', emitEvent: boolean = true): void {
    this.seatsAmountControl[action]({ emitEvent });
    this.seatsAmountControl.setValue(seatsAmount, { emitEvent });
  }
}
