import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { Constants, CropperConfigurationConstants } from 'src/app/shared/constants/constants';
import { NAME_REGEX } from 'src/app/shared/constants/regex-constants';
import { ValidationConstants } from 'src/app/shared/constants/validation';
import { InstitutionTypes } from 'src/app/shared/enum/provider';
import { Institution } from 'src/app/shared/models/institution.model';
import { InstitutionStatus } from 'src/app/shared/models/institutionStatus.model';
import { Provider } from 'src/app/shared/models/provider.model';
import { ProviderSectionItem } from 'src/app/shared/models/provider.model';
import { GetInstitutionStatus } from 'src/app/shared/store/meta-data.actions';
import { MetaDataState } from 'src/app/shared/store/meta-data.state';

@Component({
  selector: 'app-create-photo-form',
  templateUrl: './create-photo-form.component.html',
  styleUrls: ['./create-photo-form.component.scss']
})
export class CreatePhotoFormComponent implements OnInit {
  readonly validationConstants = ValidationConstants;
  readonly institutionTypes = InstitutionTypes;
  readonly cropperConfig = {
    cropperMinWidth: CropperConfigurationConstants.cropperMinWidth,
    cropperMaxWidth: CropperConfigurationConstants.cropperMaxWidth,
    cropperMinHeight: CropperConfigurationConstants.cropperMinHeight,
    cropperMaxHeight: CropperConfigurationConstants.cropperMaxHeight,
    cropperAspectRatio: CropperConfigurationConstants.galleryImagesCropperAspectRatio
  }

  @Select(MetaDataState.institutionStatuses)
  institutionStatuses$: Observable<InstitutionStatus[]>;
  destroy$: Subject<boolean> = new Subject<boolean>();

  @Input() provider: Provider;

  @Output() passPhotoFormGroup = new EventEmitter();

  PhotoFormGroup: FormGroup;
  SectionItemsFormArray = new FormArray([]);

  constructor(private formBuilder: FormBuilder, private store: Store ) {
    this.PhotoFormGroup = this.formBuilder.group({
      imageFiles: new FormControl(''),
      imageIds: new FormControl(''),
      providerSectionItems: this.SectionItemsFormArray,
      institutionStatusId: new FormControl(Constants.INSTITUTION_STATUS_ID_ABSENT_VALUE, Validators.required),
      institutionType: new FormControl('', Validators.required),
      founder: new FormControl('', [
        Validators.required, 
        Validators.pattern(NAME_REGEX),
        Validators.minLength(ValidationConstants.INPUT_LENGTH_1),
        Validators.maxLength(ValidationConstants.INPUT_LENGTH_60)
      ]),
    });
  }

  ngOnInit(): void {
    this.store.dispatch(new GetInstitutionStatus());
    this.provider ? this.activateEditMode() : this.onAddForm();
    this.passPhotoFormGroup.emit(this.PhotoFormGroup);
  }

  private activateEditMode(): void {
    this.PhotoFormGroup.patchValue(this.provider, { emitEvent: false });
    this.provider.institutionStatusId = this.provider.institutionStatusId || Constants.SOCIAL_GROUP_ID_ABSENT_VALUE;
    if (this.provider.providerSectionItems?.length) {
      this.provider.providerSectionItems.forEach((item: ProviderSectionItem) => this.SectionItemsFormArray.push(this.newForm(item)))
    } else {
      this.onAddForm();
    }
    this.PhotoFormGroup.patchValue(this.provider, { emitEvent: false });
  }

  /**
 * This method creates new FormGroup
 */
  private newForm(item?: ProviderSectionItem): FormGroup {
    const EditFormGroup = this.formBuilder.group({
      sectionName: new FormControl('', [Validators.required]),
      description: new FormControl('', [
        Validators.required,
        Validators.minLength(ValidationConstants.INPUT_LENGTH_3),
        Validators.maxLength(ValidationConstants.MAX_DESCRIPTION_LENGTH_2000)
      ]),
    });

    if (this.provider) {
      EditFormGroup.addControl('providerId', this.formBuilder.control(this.provider.id))
    }
    
    if (item){
      EditFormGroup.patchValue(item, { emitEvent: false });  
    }

    return EditFormGroup;
  }
  
  /**
   * This method creates new FormGroup adds new FormGroup to the FormArray
   */
  onAddForm(): void {
    if(this.PhotoFormGroup.get('providerSectionItems')) {
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
