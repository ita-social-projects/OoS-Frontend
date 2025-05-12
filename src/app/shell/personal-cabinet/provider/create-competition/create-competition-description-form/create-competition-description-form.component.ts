import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, takeUntil } from 'rxjs/operators';

import { MUST_CONTAIN_LETTERS } from 'shared/constants/regex-constants';
import { ValidationConstants } from 'shared/constants/validation';
import { Provider } from 'shared/models/provider.model';
import { Competition, CompetitiveDescriptionItem } from 'shared/models/competition.model';
import { FormOfLearning } from 'shared/enum/workshop';
import { FormOfLearningEnum } from 'shared/enum/enumUA/workshop';
import { Util } from 'shared/utils/utils';
import { CompetitionCoverageEnum } from 'shared/enum/enumUA/competition';
import { InstituitionHierarchy, Institution } from 'shared/models/institution.model';
import { GetAllByInstitutionAndLevel, GetAllInstitutions } from 'shared/store/meta-data.actions';
import { MetaDataState } from 'shared/store/meta-data.state';
import { CompetitionCoverage } from 'shared/enum/competition';
import { CopperConfig } from 'shared/configs/copper.config';

@Component({
  selector: 'app-create-competition-description-form',
  templateUrl: './create-competition-description-form.component.html',
  styleUrls: ['./create-competition-description-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateCompetitionDescriptionFormComponent implements OnInit, OnDestroy {
  @Select(MetaDataState.institutions)
  public institutions$: Observable<Institution[]>;
  @Select(MetaDataState.instituitionsHierarchy)
  public instituitionsHierarchy$: Observable<InstituitionHierarchy[]>;

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
  public disabilityOptionRadioBtn: FormControl = new FormControl(false);
  public selectionOptionRadioBtn: FormControl = new FormControl(false);
  public benefitsOptionRadioBtn: FormControl = new FormControl(false);
  public priceRadioBtn: FormControl = new FormControl(false);

  public EditFormGroup: FormGroup;
  public SectionItemsFormArray: FormArray = new FormArray([]);
  public filteredCompetitionCoverage: { key: string; value: string }[] = [];

  protected readonly CompetitionCoverage = CompetitionCoverage;

  private readonly destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly store: Store
  ) {}

  public get categoryControl(): FormControl {
    return this.DescriptionFormGroup.get('institutionHierarchyId') as FormControl;
  }

  public get coverageControl(): FormControl {
    return this.DescriptionFormGroup.get('coverageId') as FormControl;
  }

  public get priceControl(): FormControl {
    return this.DescriptionFormGroup.get('price') as FormControl;
  }

  public ngOnInit(): void {
    this.store.dispatch(new GetAllInstitutions(false));
    this.institutions$.pipe(takeUntil(this.destroy$)).forEach((institutions: Institution[]) => {
      if (institutions) {
        const nonGovernmentInstitution: Institution = institutions.filter((institution) => !institution.isGovernment)[0];
        this.store.dispatch(new GetAllByInstitutionAndLevel(nonGovernmentInstitution.id, nonGovernmentInstitution.numberOfHierarchyLevels));
      }
    });

    this.initForm();
    this.passDescriptionFormGroup.emit(this.DescriptionFormGroup);

    this.getFilterCompetitionCoverage();

    if (this.competition) {
      this.activateEditMode();
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
      { name: 'disabilityOptionsDesc', radioBtn: this.disabilityOptionRadioBtn },
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

    if (this.competition.optionsForPeopleWithDisabilities) {
      this.disabilityOptionRadioBtn.setValue(this.competition.optionsForPeopleWithDisabilities, { emitEvent: false });
      this.DescriptionFormGroup.get('disabilityOptionsDesc').enable({ emitEvent: false });
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

  private initForm(): void {
    this.DescriptionFormGroup = this.formBuilder.group({
      imageFiles: new FormControl(''),
      imageIds: new FormControl(''),
      institutionHierarchyId: new FormControl(null),
      subcategory: new FormControl(null),
      description: new FormControl('', [
        Validators.minLength(ValidationConstants.MIN_DESCRIPTION_LENGTH_1),
        Validators.maxLength(ValidationConstants.MAX_DESCRIPTION_LENGTH_500),
        Validators.pattern(MUST_CONTAIN_LETTERS)
      ]),
      coverageId: new FormControl(null, Validators.required),
      formOfLearning: new FormControl(FormOfLearning.Offline),
      optionsForPeopleWithDisabilities: this.disabilityOptionRadioBtn,
      disabilityOptionsDesc: new FormControl({ value: '', disabled: true }, [
        Validators.minLength(ValidationConstants.MIN_DESCRIPTION_LENGTH_1),
        Validators.maxLength(ValidationConstants.MAX_DESCRIPTION_LENGTH_500)
      ]),
      additionalDescription: new FormControl('', [
        Validators.minLength(ValidationConstants.MIN_DESCRIPTION_LENGTH_1),
        Validators.maxLength(ValidationConstants.MAX_DESCRIPTION_LENGTH_500)
      ]),
      descriptionOfTheEnrollmentProcedure: new FormControl({ value: '', disabled: true }, [
        Validators.minLength(ValidationConstants.MIN_DESCRIPTION_LENGTH_1),
        Validators.maxLength(ValidationConstants.MAX_DESCRIPTION_LENGTH_500)
      ]),
      competitiveEventDescriptionItems: this.SectionItemsFormArray,
      price: new FormControl({ value: 0, disabled: true }),
      areThereBenefits: this.benefitsOptionRadioBtn,
      benefitsOptionsDesc: new FormControl({ value: '', disabled: true }, [
        Validators.minLength(ValidationConstants.MIN_DESCRIPTION_LENGTH_1),
        Validators.maxLength(ValidationConstants.MAX_DESCRIPTION_LENGTH_500)
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
}
