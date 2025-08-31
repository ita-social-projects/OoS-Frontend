import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { asyncScheduler, merge, Observable, of, Subject, throttleTime } from 'rxjs';
import { distinctUntilChanged, filter, map, take, takeUntil } from 'rxjs/operators';

import { MUST_CONTAIN_LETTERS } from 'shared/constants/regex-constants';
import { ValidationConstants } from 'shared/constants/validation';
import { Provider } from 'shared/models/provider.model';
import { Competition, CompetitiveDescriptionItem } from 'shared/models/competition.model';
import { FormOfLearning } from 'shared/enum/workshop';
import { FormOfLearningEnum } from 'shared/enum/enumUA/workshop';
import { Util } from 'shared/utils/utils';
import { CompetitionCoverageEnum } from 'shared/enum/enumUA/competition';
import { GetDirections, GetSubDirections } from 'shared/store/meta-data.actions';
import { MetaDataState } from 'shared/store/meta-data.state';
import { CompetitionCoverage } from 'shared/enum/competition';
import { CopperConfig } from 'shared/configs/copper.config';
import { maxArrayLength, minArrayLength } from 'shared/validators/array-length/array-length-validator';
import { Direction, SubDirection } from 'shared/models/category.model';
import { ShowMessageBar } from 'shared/store/app.actions';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-create-competition-description-form',
  templateUrl: './create-competition-description-form.component.html',
  styleUrls: ['./create-competition-description-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateCompetitionDescriptionFormComponent implements OnInit, OnDestroy {
  @Select(MetaDataState.directions)
  public directions$: Observable<Direction[]>;
  @Select(MetaDataState.subDirections)
  public subDirections$: Observable<SubDirection[]>;

  @Input() public competition: Competition;
  @Input() public isImagesFeature: boolean;
  @Input() public provider: Provider;

  @Output() public passDescriptionFormGroup = new EventEmitter();

  public readonly CompetitionCoverageEnum = CompetitionCoverageEnum;
  public readonly validationConstants = ValidationConstants;
  public readonly FormOfLearning = FormOfLearning;
  public readonly FormOfLearningEnum = FormOfLearningEnum;
  public readonly Util = Util;
  public readonly cropperConfig = CopperConfig;

  public DescriptionFormGroup: FormGroup;
  public selectionOptionRadioBtn: FormControl = new FormControl(false);
  public benefitsOptionRadioBtn: FormControl = new FormControl(false);
  public priceRadioBtn: FormControl = new FormControl(false);

  public EditFormGroup: FormGroup;
  public SectionItemsFormArray: FormArray = new FormArray([]);
  public filteredCompetitionCoverage: { key: string; value: string }[] = [];

  private readonly destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly store: Store,
    private readonly route: ActivatedRoute,
    private readonly translateService: TranslateService
  ) {}

  public get directionControl(): FormControl {
    return this.DescriptionFormGroup.get('directionId') as FormControl;
  }

  public get subDirectionControl(): FormControl {
    return this.DescriptionFormGroup.get('subDirectionIds') as FormControl;
  }

  public get coverageControl(): FormControl {
    return this.DescriptionFormGroup.get('coverageId') as FormControl;
  }

  public get priceControl(): FormControl {
    return this.DescriptionFormGroup.get('price') as FormControl;
  }

  public ngOnInit(): void {
    this.store.dispatch(new GetDirections());

    this.initForm();
    this.passDescriptionFormGroup.emit(this.DescriptionFormGroup);

    this.getFilterCompetitionCoverage();
    this.directionControlListener();

    if (this.competition) {
      this.activateEditMode();
    } else {
      this.onAddForm();
    }

    this.initializeFormControls();
    this.priceControlListener();
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  /**
   * This method makes input enable if radiobutton value is true and sets the value to the FormGroup
   */
  public onControlInit(controlName: string, radioBtn: AbstractControl): void {
    const control = this.DescriptionFormGroup.get(controlName);
    radioBtn.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((isEnabled: boolean) => {
      if (isEnabled) {
        control.enable();
      } else {
        control.disable();
        control.reset();
      }
      this.markFormAsDirtyOnUserInteraction();
    });
  }

  /**
   * Initialize all form controls with corresponding radio buttons
   */
  public initializeFormControls(): void {
    const controls = [
      { name: 'descriptionOfTheEnrollmentProcedure', radioBtn: this.selectionOptionRadioBtn },
      { name: 'benefitsOptionsDesc', radioBtn: this.benefitsOptionRadioBtn },
      { name: 'price', radioBtn: this.priceRadioBtn }
    ];

    controls.forEach((controlProperties) => {
      const { name, radioBtn } = controlProperties;
      this.onControlInit(name, radioBtn);
    });
  }

  public onFocusOut(formControlName: string): void {
    if (this.DescriptionFormGroup.get(formControlName).pristine && !this.DescriptionFormGroup.get(formControlName).value) {
      this.DescriptionFormGroup.get(formControlName).setValue(null);
    }
  }

  /**
   * This method fills inputs with information of edited workshop
   */
  public activateEditMode(): void {
    this.DescriptionFormGroup.patchValue(this.competition, { emitEvent: false });

    if (this.competition.directionSubDirectionIds?.length) {
      this.directionControl.patchValue(this.competition.directionSubDirectionIds[0].directionId);
    }

    if (this.competition.competitiveSelection) {
      this.selectionOptionRadioBtn.setValue(this.competition.competitiveSelection, { emitEvent: false });
      this.DescriptionFormGroup.get('descriptionOfTheEnrollmentProcedure').enable({ emitEvent: false });
    }

    if (this.competition.price) {
      this.priceRadioBtn.setValue(!!this.competition.price, { emitEvent: false });
      this.DescriptionFormGroup.get('price').enable({ emitEvent: false });
    }

    if (this.competition.coverageId) {
      this.coverageControl.setValue(String(this.competition.coverageId), { emitEvent: false });
    }

    if (this.competition.competitiveEventDescriptionItems?.length) {
      this.competition.competitiveEventDescriptionItems.forEach((item: CompetitiveDescriptionItem) => {
        const itemFrom = this.newForm(item);
        this.SectionItemsFormArray.controls.push(itemFrom);
        // eslint-disable-next-line dot-notation, @typescript-eslint/dot-notation
        this.SectionItemsFormArray['_registerControl'](itemFrom);
      });
    } else {
      this.onAddForm();
    }

    if (this.competition.areThereBenefits) {
      this.benefitsOptionRadioBtn.setValue(this.competition.benefits, { emitEvent: false });
      this.DescriptionFormGroup.get('benefitsOptionsDesc').enable({ emitEvent: false });
    }

    if (this.competition.subDirectionIds) {
      this.subDirections$.pipe(filter(Boolean), take(1)).subscribe((subDirections: SubDirection[]) => {
        const value = subDirections.filter((subDirection) => this.competition.subDirectionIds.includes(subDirection.id));
        asyncScheduler.schedule(() => this.subDirectionControl.patchValue(value, { emitEvent: false }));
      });
    }

    if (!this.route.snapshot.paramMap.has('entity')) {
      this.listenToChanges();
    }
  }

  /**
   * This method creates new FormGroup adds new FormGroup to the FormArray
   */
  public onAddForm(): void {
    if (this.DescriptionFormGroup.get('competitiveEventDescriptionItems')) {
      (this.DescriptionFormGroup.get('competitiveEventDescriptionItems') as FormArray).push(this.newForm());
    }
  }

  /**
   * This method delete FormGroup from the FormArray by index
   * @param index
   */
  public onDeleteForm(index: number): void {
    this.SectionItemsFormArray.removeAt(index);
    this.markFormAsDirtyOnUserInteraction();
  }

  public compareItems(item1: SubDirection, item2: SubDirection): boolean {
    if (!item1 || !item2) {
      return false;
    }
    return item1.id === item2.id;
  }

  public onRemove(item: SubDirection): void {
    const currentValue = this.subDirectionControl.value;
    const newValue = currentValue.filter((subDirection: SubDirection) => subDirection.id !== item.id);
    this.subDirectionControl.patchValue(newValue);
  }

  private initForm(): void {
    this.DescriptionFormGroup = this.formBuilder.group({
      imageFiles: new FormControl('', [Validators.required, minArrayLength(1), maxArrayLength(10)]),
      imageIds: new FormControl(''),
      directionId: new FormControl(null, Validators.required),
      subDirectionIds: new FormControl(null, Validators.required),
      description: new FormControl('', [
        Validators.minLength(ValidationConstants.MIN_DESCRIPTION_LENGTH_3),
        Validators.maxLength(ValidationConstants.MAX_DESCRIPTION_LENGTH_500),
        Validators.pattern(MUST_CONTAIN_LETTERS)
      ]),
      coverageId: new FormControl(null, Validators.required),
      formOfLearning: new FormControl(FormOfLearning.Offline),
      disabilityOptionsDesc: new FormControl({ value: '', disabled: true }, [
        Validators.minLength(ValidationConstants.MIN_DESCRIPTION_LENGTH_3),
        Validators.maxLength(ValidationConstants.MAX_DESCRIPTION_LENGTH_500),
        Validators.pattern(MUST_CONTAIN_LETTERS)
      ]),
      additionalDescription: new FormControl('', [
        Validators.minLength(ValidationConstants.MIN_DESCRIPTION_LENGTH_3),
        Validators.maxLength(ValidationConstants.MAX_DESCRIPTION_LENGTH_500),
        Validators.pattern(MUST_CONTAIN_LETTERS)
      ]),
      descriptionOfTheEnrollmentProcedure: new FormControl({ value: '', disabled: true }, [
        Validators.minLength(ValidationConstants.MIN_DESCRIPTION_LENGTH_3),
        Validators.maxLength(ValidationConstants.MAX_DESCRIPTION_LENGTH_500),
        Validators.pattern(MUST_CONTAIN_LETTERS)
      ]),
      competitiveEventDescriptionItems: this.SectionItemsFormArray,
      price: new FormControl({ value: 0, disabled: true }),
      venueName: new FormControl('', [
        Validators.minLength(ValidationConstants.INPUT_LENGTH_1),
        Validators.maxLength(ValidationConstants.INPUT_LENGTH_60)
      ]),
      termsOfParticipation: new FormControl('', [
        Validators.minLength(ValidationConstants.MIN_DESCRIPTION_LENGTH_1),
        Validators.maxLength(ValidationConstants.MAX_DESCRIPTION_LENGTH_500)
      ]),
      areThereBenefits: this.benefitsOptionRadioBtn,
      benefitsOptionsDesc: new FormControl({ value: '', disabled: true }, [
        Validators.minLength(ValidationConstants.MIN_DESCRIPTION_LENGTH_3),
        Validators.maxLength(ValidationConstants.MAX_DESCRIPTION_LENGTH_500),
        Validators.pattern(MUST_CONTAIN_LETTERS)
      ])
    });
  }

  /**
   * This method makes DescriptionFormGroup dirty
   */
  private markFormAsDirtyOnUserInteraction(): void {
    if (!this.DescriptionFormGroup.dirty) {
      this.DescriptionFormGroup.markAsDirty({ onlySelf: true });
    }
  }

  /**
   * This method creates new FormGroup
   */
  private newForm(item?: CompetitiveDescriptionItem): FormGroup {
    this.EditFormGroup = this.formBuilder.group({
      sectionName: new FormControl('', [
        Validators.required,
        Validators.minLength(ValidationConstants.INPUT_LENGTH_3),
        Validators.maxLength(ValidationConstants.INPUT_LENGTH_100),
        Validators.pattern(MUST_CONTAIN_LETTERS)
      ]),
      description: new FormControl('', [
        Validators.required,
        Validators.minLength(ValidationConstants.INPUT_LENGTH_3),
        Validators.maxLength(ValidationConstants.MAX_DESCRIPTION_LENGTH_2000),
        Validators.pattern(MUST_CONTAIN_LETTERS)
      ])
    });

    if (this.competition) {
      this.EditFormGroup.addControl('competitiveEventId', this.formBuilder.control(this.competition.id));
    }

    if (item) {
      this.EditFormGroup.patchValue(item, { emitEvent: false });
    }

    return this.EditFormGroup;
  }

  private getFilterCompetitionCoverage(): void {
    this.filteredCompetitionCoverage = Object.entries(CompetitionCoverage)
      .filter(([key]) => !isNaN(Number(key)))
      .map(([key, value]) => ({ key, value: value as string }));
  }

  private priceControlListener(): void {
    this.priceControl.valueChanges
      .pipe(
        map((val) => !!val),
        distinctUntilChanged(),
        filter(() => this.benefitsOptionRadioBtn.value),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.benefitsOptionRadioBtn.setValue(false);
      });
  }

  private directionControlListener(): void {
    this.directionControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((directionId: string) => {
      this.subDirectionControl.reset(null, { emitEvent: false });
      this.subDirectionControl.setErrors(null);
      this.store.dispatch(new GetSubDirections(directionId));
    });
  }

  private listenToChanges(): void {
    const fieldsToListen = [
      'imageFiles',
      'description',
      'disabilityOptionsDesc',
      'additionalDescription',
      'descriptionOfTheEnrollmentProcedure',
      'competitiveEventDescriptionItems',
      'benefitsOptionsDesc'
    ];

    const mappedFields = fieldsToListen.map(
      (controlName) =>
        this.DescriptionFormGroup.get(controlName)?.valueChanges.pipe(
          throttleTime(5000, undefined, {
            leading: true,
            trailing: false
          })
        ) ?? of()
    );

    merge(...mappedFields)
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
