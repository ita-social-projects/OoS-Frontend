import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject, takeLast } from 'rxjs';

import { CropperConfigurationConstants } from 'shared/constants/constants';
import { MUST_CONTAIN_LETTERS } from 'shared/constants/regex-constants';
import { ValidationConstants } from 'shared/constants/validation';
import { Provider } from 'shared/models/provider.model';
import { Competition } from 'shared/models/competition.model';
import { CompetitionCoverage } from 'shared/enum/Competition';
import { FormOfLearning } from 'shared/enum/workshop';
import { FormOfLearningEnum } from 'shared/enum/enumUA/workshop';
import { Util } from 'shared/utils/utils';
import { map, takeUntil } from 'rxjs/operators';
import { CompetitionCoverageEnum } from 'shared/enum/enumUA/competition';
import { Select, Store } from '@ngxs/store';
import { InstituitionHierarchy, Institution } from 'shared/models/institution.model';
import { GetAllByInstitutionAndLevel, GetAllInstitutions, GetAllInstitutionsHierarchy } from 'shared/store/meta-data.actions';
import { MetaDataState } from 'shared/store/meta-data.state';

@Component({
  selector: 'app-create-competition-description-form',
  templateUrl: './create-competition-description-form.component.html',
  styleUrls: ['./create-competition-description-form.component.scss']
})
export class CreateCompetitionDescriptionFormComponent implements OnInit, OnDestroy {
  @Select(MetaDataState.institutions)
  institutions$: Observable<Institution[]>;
  @Select(MetaDataState.instituitionsHierarchy)
  instituitionsHierarchy$: Observable<InstituitionHierarchy[]>;

  @Input() public competition: Competition;
  @Input() public isImagesFeature: boolean;
  @Input() public provider: Provider;

  @Output() public passDescriptionFormGroup = new EventEmitter();

  protected readonly CompetitionCoverage = CompetitionCoverage;

  public readonly CompetitionCoverageEnum = CompetitionCoverageEnum;
  public readonly validationConstants = ValidationConstants;
  public readonly FormOfLearning = FormOfLearning;
  public readonly FormOfLearningEnum = FormOfLearningEnum;
  public readonly Util = Util;
  public readonly cropperConfig = {
    cropperMinWidth: CropperConfigurationConstants.cropperMinWidth,
    cropperMaxWidth: CropperConfigurationConstants.cropperMaxWidth,
    cropperMinHeight: CropperConfigurationConstants.cropperMinHeight,
    cropperMaxHeight: CropperConfigurationConstants.cropperMaxHeight,
    cropperAspectRatio: CropperConfigurationConstants.galleryImagesCropperAspectRatio,
    croppedHeight: CropperConfigurationConstants.croppedGalleryImage.height,
    croppedFormat: CropperConfigurationConstants.croppedFormat,
    croppedQuality: CropperConfigurationConstants.croppedQuality
  };

  public DescriptionFormGroup: FormGroup;
  public disabilityOptionRadioBtn: FormControl = new FormControl(false);
  public selectionOptionRadioBtn: FormControl = new FormControl(false);
  public benefitsOptionRadioBtn: FormControl = new FormControl(false);
  public priceRadioBtn: FormControl = new FormControl(false);

  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private formBuilder: FormBuilder,
    private store: Store
  ) {}

  public ngOnInit(): void {
    this.store.dispatch(new GetAllInstitutions(false));
    this.institutions$.forEach((institutions: Institution[]) => {
      if (institutions) {
        const nonGovernmentInstitution: Institution = institutions.filter((institution) => !institution.isGovernment)[0];
        this.store.dispatch(new GetAllByInstitutionAndLevel(nonGovernmentInstitution.id, nonGovernmentInstitution.numberOfHierarchyLevels));
      }
    });

    this.initForm();

    this.onDisabilityOptionCtrlInit();
    this.onSelectionOptionsCtrlInit();
    this.onBenefitsOptionsCtrlInit();
    this.onPriceControlInit();

    this.passDescriptionFormGroup.emit(this.DescriptionFormGroup);
  }

  public get categoryControl(): FormControl {
    return this.DescriptionFormGroup.get('category') as FormControl;
  }

  public get competitionCoverageControl(): FormControl {
    return this.DescriptionFormGroup.get('competitionCoverage') as FormControl;
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  /**
   * This method makes input enable if radiobutton value is true and sets the value to the FormGroup
   */
  public onDisabilityOptionCtrlInit(): void {
    const setAction = (action: string): void => this.DescriptionFormGroup.get('disabilityOptionsDesc')[action]();
    this.disabilityOptionRadioBtn.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((isDisabilityOptionsDesc: boolean) => {
      if (isDisabilityOptionsDesc) {
        setAction('enable');
      } else {
        setAction('disable');
        this.DescriptionFormGroup.get('disabilityOptionsDesc').reset();
      }
      this.markFormAsDirtyOnUserInteraction();
    });
  }

  /**
   * This method makes input enable if radiobutton value is true and sets the value to the FormGroup
   */
  public onSelectionOptionsCtrlInit(): void {
    const setAction = (action: string): void => this.DescriptionFormGroup.get('selectionOptionsDesc')[action]();
    this.selectionOptionRadioBtn.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((isSelectionOptions: boolean) => {
      if (isSelectionOptions) {
        setAction('enable');
      } else {
        setAction('disable');
        this.DescriptionFormGroup.get('selectionOptionsDesc').reset();
      }
      this.markFormAsDirtyOnUserInteraction();
    });
  }

  /**
   * This method makes input enable if radiobutton value is true and sets the value to the FormGroup
   */
  public onBenefitsOptionsCtrlInit(): void {
    const setAction = (action: string): void => this.DescriptionFormGroup.get('benefitsOptionsDesc')[action]();
    this.benefitsOptionRadioBtn.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((isBenefitsOptions: boolean) => {
      if (isBenefitsOptions) {
        setAction('enable');
      } else {
        setAction('disable');
        this.DescriptionFormGroup.get('benefitsOptionsDesc').reset();
      }
      this.markFormAsDirtyOnUserInteraction();
    });
  }

  /**
   * This method makes input enable if radiobutton value is true and sets the value to the FormGroup
   */
  public onPriceControlInit(): void {
    const setAction = (action: string): void => this.DescriptionFormGroup.get('price')[action]();
    this.priceRadioBtn.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((isPrice: boolean) => {
      if (isPrice) {
        setAction('enable');
      } else {
        setAction('disable');
        this.DescriptionFormGroup.get('price').reset();
      }
      this.markFormAsDirtyOnUserInteraction();
    });
  }

  public sortTime(): number {
    return 0;
  }

  public onFocusOut(formControlName: string): void {
    if (this.DescriptionFormGroup.get(formControlName).pristine && !this.DescriptionFormGroup.get(formControlName).value) {
      this.DescriptionFormGroup.get(formControlName).setValue(null);
    }
  }

  private initForm(): void {
    this.DescriptionFormGroup = this.formBuilder.group({
      imageFiles: new FormControl(''),
      imageIds: new FormControl(''),
      category: new FormControl(null),
      subcategory: new FormControl(null),
      description: new FormControl('', [
        Validators.minLength(ValidationConstants.MIN_DESCRIPTION_LENGTH_1),
        Validators.maxLength(ValidationConstants.MAX_DESCRIPTION_LENGTH_500),
        Validators.pattern(MUST_CONTAIN_LETTERS)
      ]),
      competitionCoverage: new FormControl(null),
      formOfLearning: new FormControl(FormOfLearning.Offline),
      disabilityOptionsDesc: new FormControl({ value: '', disabled: true }, [
        Validators.minLength(ValidationConstants.MIN_DESCRIPTION_LENGTH_1),
        Validators.maxLength(ValidationConstants.MAX_DESCRIPTION_LENGTH_500)
      ]),
      additionalDescription: new FormControl('', [
        Validators.minLength(ValidationConstants.MIN_DESCRIPTION_LENGTH_1),
        Validators.maxLength(ValidationConstants.MAX_DESCRIPTION_LENGTH_500)
      ]),
      minAge: new FormControl(null),
      maxAge: new FormControl(null),
      selectionOptionsDesc: new FormControl({ value: '', disabled: true }, [
        Validators.minLength(ValidationConstants.MIN_DESCRIPTION_LENGTH_1),
        Validators.maxLength(ValidationConstants.MAX_DESCRIPTION_LENGTH_500)
      ]),
      price: new FormControl({ value: 0, disabled: true }),
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
}
