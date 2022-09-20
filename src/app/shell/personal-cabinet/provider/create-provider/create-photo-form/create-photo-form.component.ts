import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { Constants, CropperConfigurationConstants } from 'src/app/shared/constants/constants';
import { takeUntil, filter, first } from 'rxjs/operators';
import { NAME_REGEX } from 'src/app/shared/constants/regex-constants';
import { ValidationConstants } from 'src/app/shared/constants/validation';
import { InstitutionStatus } from 'src/app/shared/models/institutionStatus.model';
import { Provider } from 'src/app/shared/models/provider.model';
import { ProviderSectionItem } from 'src/app/shared/models/provider.model';
import { GetInstitutionStatus } from 'src/app/shared/store/meta-data.actions';
import { MetaDataState } from 'src/app/shared/store/meta-data.state';
import { InstitutionTypes } from 'src/app/shared/enum/enumUA/provider';

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

  @Output() passPhotoFormGroup = new EventEmitter();

  @Select(MetaDataState.institutionStatuses)
  institutionStatuses$: Observable<InstitutionStatus[]>;
  institutionStatuses: InstitutionStatus[];

  PhotoFormGroup: UntypedFormGroup;
  SectionItemsFormArray = new UntypedFormArray([]);
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private formBuilder: UntypedFormBuilder, private store: Store) {
    this.PhotoFormGroup = this.formBuilder.group({
      imageFiles: new UntypedFormControl(''),
      imageIds: new UntypedFormControl(''),
      providerSectionItems: this.SectionItemsFormArray,
      institutionStatusId: new UntypedFormControl('', Validators.required),
      institutionType: new UntypedFormControl('', Validators.required),
      founder: new UntypedFormControl('', [
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
  private newForm(item?: ProviderSectionItem): UntypedFormGroup {
    const EditFormGroup = this.formBuilder.group({
      sectionName: new UntypedFormControl('', [Validators.required]),
      description: new UntypedFormControl('', [
        Validators.required,
        Validators.minLength(ValidationConstants.INPUT_LENGTH_3),
        Validators.maxLength(ValidationConstants.MAX_DESCRIPTION_LENGTH_2000),
      ]),
    });

    if (this.provider) {
      EditFormGroup.addControl('providerId', this.formBuilder.control(this.provider.id));
    }

    if (item) {
      EditFormGroup.patchValue(item, { emitEvent: false });
    }

    return EditFormGroup;
  }

  /**
   * This method creates new FormGroup adds new FormGroup to the FormArray
   */
  onAddForm(): void {
    if (this.PhotoFormGroup.get('providerSectionItems')) {
      (this.PhotoFormGroup.get('providerSectionItems') as UntypedFormArray).push(this.newForm());
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
