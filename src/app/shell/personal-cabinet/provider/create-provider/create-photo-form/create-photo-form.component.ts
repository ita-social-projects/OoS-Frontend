import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { CropperConfigurationConstants, Constants } from '../../../../../shared/constants/constants';
import { ValidationConstants } from '../../../../../shared/constants/validation';
import { Provider, ProviderSectionItem } from '../../../../../shared/models/provider.model';

@Component({
  selector: 'app-create-photo-form',
  templateUrl: './create-photo-form.component.html',
  styleUrls: ['./create-photo-form.component.scss'],
})
export class CreatePhotoFormComponent implements OnInit {
  readonly validationConstants = ValidationConstants;

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

  PhotoFormGroup: FormGroup;
  SectionItemsFormArray = new FormArray([]);
  editFormGroup: FormGroup;

  get providerSectionItemsControl(): AbstractControl {
    return this.PhotoFormGroup.get('providerSectionItems');
  }

  constructor(private formBuilder: FormBuilder, private store: Store) {
    this.PhotoFormGroup = this.formBuilder.group({
      imageFiles: new FormControl(''),
      imageIds: new FormControl(''),
      providerSectionItems: this.SectionItemsFormArray,
      website: new FormControl('', [Validators.maxLength(ValidationConstants.INPUT_LENGTH_256)]),
      facebook: new FormControl('', [Validators.maxLength(ValidationConstants.INPUT_LENGTH_256)]),
      instagram: new FormControl('', [Validators.maxLength(ValidationConstants.INPUT_LENGTH_256)]),
    });
  }

  ngOnInit(): void {
    this.passPhotoFormGroup.emit(this.PhotoFormGroup);
    if(this.provider) {
      this.activateEditMode();
    } else {
      this.onAddForm();
    }
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
    if (this.providerSectionItemsControl) {
      (this.providerSectionItemsControl as FormArray).push(this.newForm());
    }
  }

  /**
   * This method delete FormGroup from the FormArray by index
   * @param index
   */
  onDeleteForm(index: number): void {
    this.SectionItemsFormArray.removeAt(index);
  }
}
