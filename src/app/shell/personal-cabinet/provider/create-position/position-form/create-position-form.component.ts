import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Select } from '@ngxs/store';
import { Subject, takeUntil } from 'rxjs';
import { Constants } from 'shared/constants/constants';
import { ValidationConstants } from 'shared/constants/validation';
import { InfoMenuType } from 'shared/enum/info-menu-type';
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

  public PositionFormGroup: FormGroup;
  public readonly validationConstants = ValidationConstants;
  public numOfSeatsRadioBtnControl: FormControl = new FormControl(true);
  public readonly InfoMenuType = InfoMenuType;
  public readonly UNLIMITED_SEATS = Constants.WORKSHOP_UNLIMITED_SEATS;
  public readonly minSeats = 0;

  private readonly destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private readonly fb: FormBuilder) {}

  public get numOfSeatsControl(): FormControl {
    return this.PositionFormGroup.get('numOfSeats') as FormControl;
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
      fullName: this.position.fullName ?? '',
      shortName: this.position.shortName ?? '',
      description: this.position.description ?? '',
      forRuralAres: this.position.forRuralAres ?? false,
      openedInDepartment: this.position.openedInDepartment ?? '',
      provider: this.position.provider ?? this.provider?.id,
      numOfSeats: this.position.numOfSeats ?? null,
      nameInGenitiveCase: this.position.nameInGenitiveCase ?? '',
      teachingPosition: this.position.teachingPosition ?? false,
      rate: this.position.rate ?? '',
      tariff: this.position.tariff ?? '',
      typeByClassifier: this.position.typeByClassifier ?? ''
    });

    const noLimitSeats = this.position.numOfSeats === null;
    this.numOfSeatsRadioBtnControl.setValue(noLimitSeats, { emitEvent: false });

    if (noLimitSeats) {
      this.setNumOfSeatsControlValue(null, 'disable', false);
    } else {
      this.setNumOfSeatsControlValue(this.position.numOfSeats, 'enable', false);
    }
  }

  private createPositionForm(): void {
    this.PositionFormGroup = this.fb.group({
      fullName: [
        '',
        [
          Validators.required,
          Validators.minLength(this.validationConstants.INPUT_LENGTH_1),
          Validators.maxLength(this.validationConstants.INPUT_LENGTH_60)
        ]
      ],
      shortName: [
        '',
        [
          Validators.required,
          Validators.minLength(this.validationConstants.INPUT_LENGTH_1),
          Validators.maxLength(this.validationConstants.INPUT_LENGTH_60)
        ]
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(this.validationConstants.INPUT_LENGTH_1),
          Validators.maxLength(this.validationConstants.INPUT_LENGTH_500)
        ]
      ],
      forRuralAres: [false],
      openedInDepartment: [''],
      provider: [this.provider.id],
      numOfSeats: [{ value: null, disabled: true }, [Validators.required, Validators.min(this.minSeats)]],
      nameInGenitiveCase: [''],
      teachingPosition: [false],
      rate: ['', [Validators.required, Validators.min(1), Validators.max(10)]],
      tariff: ['', [Validators.required, Validators.min(1), Validators.max(10)]],
      typeByClassifier: ['']
    });
    this.passPositionFormGroup.emit(this.PositionFormGroup);
  }

  private initListeners(): void {
    this.availableSeatsControlListener();
  }

  private availableSeatsControlListener(): void {
    this.numOfSeatsRadioBtnControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((noLimit: boolean) => {
      this.markFormAsDirtyOnUserInteraction();
      if (noLimit) {
        this.setNumOfSeatsControlValue(null, 'disable');
      } else {
        this.setNumOfSeatsControlValue(this.minSeats, 'enable');
      }
    });
  }

  private setNumOfSeatsControlValue(numOfSeats: number = null, action: string = 'disable', emitEvent: boolean = true): void {
    this.numOfSeatsControl[action]({ emitEvent });
    this.numOfSeatsControl.setValue(numOfSeats, { emitEvent });
  }
}
