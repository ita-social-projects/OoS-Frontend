import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil, filter, first } from 'rxjs/operators';
import { CropperConfigurationConstants, Constants } from '../../../../../shared/constants/constants';
import { NAME_REGEX } from '../../../../../shared/constants/regex-constants';
import { ValidationConstants } from '../../../../../shared/constants/validation';
import { InstitutionTypes } from '../../../../../shared/enum/enumUA/provider';
import { InstitutionStatus } from '../../../../../shared/models/institutionStatus.model';
import { Provider, ProviderSectionItem } from '../../../../../shared/models/provider.model';
import { GetInstitutionStatus } from '../../../../../shared/store/meta-data.actions';
import { MetaDataState } from '../../../../../shared/store/meta-data.state';

@Component({
  selector: 'app-create-photo-form',
  templateUrl: './create-photo-form.component.html',
  styleUrls: ['./create-photo-form.component.scss'],
})
export class CreatePhotoFormComponent implements OnInit, OnDestroy {
  readonly validationConstants = ValidationConstants;
  readonly institutionTypes = InstitutionTypes;
  readonly cropperConfig = {
    cropperMinWidth: CropperConfigurationConstants.cropperMinWidth,
    cropperMaxWidth: CropperConfigurationConstants.cropperMaxWidth,
    cropperMinHeight: CropperConfigurationConstants.cropperMinHeight,
    cropperMaxHeight: CropperConfigurationConstants.cropperMaxHeight,
    cropperAspectRatio: CropperConfigurationConstants.galleryImagesCropperAspectRatio,
    croppedHeight: CropperConfigurationConstants.croppedGalleryImage.height,
    croppedFormat: CropperConfigurationConstants.croppedFormat,
    croppedQuality: CropperConfigurationConstants.croppedQuality,
  };

  @Input() provider: Provider;
  @Input() isRelease3: boolean;

  @Output() passPhotoFormGroup = new EventEmitter();

  @Select(MetaDataState.institutionStatuses)
    institutionStatuses$: Observable<InstitutionStatus[]>;
  institutionStatuses: InstitutionStatus[];

  PhotoFormGroup: FormGroup;
  SectionItemsFormArray = new FormArray([]);
  editFormGroup: FormGroup;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private formBuilder: FormBuilder, private store: Store) {
    this.PhotoFormGroup = this.formBuilder.group({
      imageFiles: new FormControl(''),
      imageIds: new FormControl(''),
      providerSectionItems: this.SectionItemsFormArray,
      institutionStatusId: new FormControl('', Validators.required),
      institutionType: new FormControl('', Validators.required),
      founder: new FormControl('', [
        Validators.required,
        Validators.pattern(NAME_REGEX),
        Validators.minLength(ValidationConstants.INPUT_LENGTH_1),
        Validators.maxLength(ValidationConstants.INPUT_LENGTH_60),
      ]),
    });
  }

  ngOnInit(): void {
    this.store.dispatch(new GetInstitutionStatus());
    this.passPhotoFormGroup.emit(this.PhotoFormGroup);

    this.institutionStatuses$
      .pipe(
        filter((institutionStatuses: InstitutionStatus[]) => !!institutionStatuses),
        first(),
        takeUntil(this.destroy$)
      )
      .subscribe((institutionStatuses: InstitutionStatus[]) => {
        this.institutionStatuses = institutionStatuses;
        if (this.provider) {
          this.activateEditMode();
        } else {
          this.onAddForm();
          this.PhotoFormGroup.get('institutionStatusId').setValue(institutionStatuses[0].id, { emitEvent: false });
        }
      });
  }

  private activateEditMode(): void {
    this.PhotoFormGroup.patchValue(this.provider, { emitEvent: false });
    this.provider.institutionStatusId = this.provider.institutionStatusId || Constants.INSTITUTION_ID_ABSENT_VALUE;
    if (this.provider.providerSectionItems?.length) {
      this.provider.providerSectionItems.forEach((item: ProviderSectionItem) => {
        const itemFrom = this.newForm(item);
        this.SectionItemsFormArray.controls.push(itemFrom);
        this.SectionItemsFormArray['_registerControl'](itemFrom);
      });
    } else {
      this.onAddForm();
    }
    this.PhotoFormGroup.patchValue(this.provider, { emitEvent: false });
  }

  /**
   * This method creates new FormGroup
   */
  private newForm(item?: ProviderSectionItem): FormGroup {
    this.editFormGroup = this.formBuilder.group({
      sectionName: new FormControl('', [Validators.required]),
      description: new FormControl('', [
        Validators.required,
        Validators.minLength(ValidationConstants.INPUT_LENGTH_3),
        Validators.maxLength(ValidationConstants.MAX_DESCRIPTION_LENGTH_2000),
      ]),
    });

    if (this.provider) {
      this.editFormGroup.addControl('providerId', this.formBuilder.control(this.provider.id));
    }

    if (item) {
      this.editFormGroup.patchValue(item, { emitEvent: false });
    }

    return this.editFormGroup;
  }

  /**
   * This method creates new FormGroup adds new FormGroup to the FormArray
   */
  onAddForm(): void {
    if (this.PhotoFormGroup.get('providerSectionItems')) {
      (this.PhotoFormGroup.get('providerSectionItems') as FormArray).push(this.newForm());
    }
  }

  /**
   * This method delete FormGroup from the FormArray by index
   * @param index
   */
  onDeleteForm(index: number): void {
    this.SectionItemsFormArray.removeAt(index);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
