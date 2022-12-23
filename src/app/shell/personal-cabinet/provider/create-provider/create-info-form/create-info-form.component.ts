import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Constants, CropperConfigurationConstants } from '../../../../../shared/constants/constants';
import { DATE_REGEX, NAME_REGEX } from '../../../../../shared/constants/regex-constants';
import { ValidationConstants } from '../../../../../shared/constants/validation';
import { OwnershipTypeEnum, ProviderTypeUkr } from '../../../../../shared/enum/enumUA/provider';
import { OwnershipType, ProviderType } from '../../../../../shared/enum/provider';
import { Institution } from '../../../../../shared/models/institution.model';
import { Provider } from '../../../../../shared/models/provider.model';
import { GetAllInstitutions } from '../../../../../shared/store/meta-data.actions';
import { MetaDataState } from '../../../../../shared/store/meta-data.state';
import { Util } from '../../../../../shared/utils/utils';

@Component({
  selector: 'app-create-info-form',
  templateUrl: './create-info-form.component.html',
  styleUrls: ['./create-info-form.component.scss']
})
export class CreateInfoFormComponent implements OnInit {
  readonly validationConstants = ValidationConstants;
  readonly dateFormPlaceholder = Constants.DATE_FORMAT_PLACEHOLDER;
  readonly mailFormPlaceholder = Constants.MAIL_FORMAT_PLACEHOLDER;
  readonly phonePrefix = Constants.PHONE_PREFIX;
  readonly ownershipType = OwnershipType;
  readonly providerType = ProviderType;
  readonly OwnershipTypeEnum = OwnershipTypeEnum;
  readonly providerTypeUkr = ProviderTypeUkr;
  readonly cropperConfig = {
    cropperMinWidth: CropperConfigurationConstants.cropperMinWidth,
    cropperMaxWidth: CropperConfigurationConstants.cropperMaxWidth,
    cropperMinHeight: CropperConfigurationConstants.cropperMinHeight,
    cropperMaxHeight: CropperConfigurationConstants.cropperMaxHeight,
    cropperAspectRatio: CropperConfigurationConstants.coverImageCropperAspectRatio,
    croppedHeight: CropperConfigurationConstants.croppedCoverImage.height,
    croppedFormat: CropperConfigurationConstants.croppedFormat,
    croppedQuality: CropperConfigurationConstants.croppedQuality
  };

  @Select(MetaDataState.institutions)
  institutions$: Observable<Institution[]>;

  @Input() provider: Provider;
  @Input() isRelease3: boolean;

  @Output() passInfoFormGroup = new EventEmitter();

  InfoFormGroup: FormGroup;
  dateFilter: RegExp = DATE_REGEX;
  maxDate: Date = Util.getMaxBirthDate();
  minDate: Date = Util.getMinBirthDate(ValidationConstants.BIRTH_AGE_MAX);

  constructor(private formBuilder: FormBuilder, private store: Store) {
    this.InfoFormGroup = this.formBuilder.group({
      fullTitle: new FormControl('', [
        Validators.required,
        Validators.minLength(ValidationConstants.INPUT_LENGTH_1),
        Validators.maxLength(ValidationConstants.INPUT_LENGTH_60)
      ]),
      shortTitle: new FormControl('', [
        Validators.required,
        Validators.minLength(ValidationConstants.INPUT_LENGTH_1),
        Validators.maxLength(ValidationConstants.INPUT_LENGTH_60)
      ]),
      edrpouIpn: new FormControl('', [
        Validators.required,
        Validators.minLength(ValidationConstants.INPUT_LENGTH_8),
        Validators.maxLength(ValidationConstants.INPUT_LENGTH_10)
      ]),
      director: new FormControl('', [
        Validators.required,
        Validators.pattern(NAME_REGEX),
        Validators.minLength(ValidationConstants.INPUT_LENGTH_1),
        Validators.maxLength(ValidationConstants.INPUT_LENGTH_60)
      ]),
      directorDateOfBirth: new FormControl('', Validators.required),
      phoneNumber: new FormControl('', [Validators.required, Validators.minLength(ValidationConstants.PHONE_LENGTH)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      website: new FormControl('', [Validators.maxLength(ValidationConstants.INPUT_LENGTH_256)]),
      facebook: new FormControl('', [Validators.maxLength(ValidationConstants.INPUT_LENGTH_256)]),
      instagram: new FormControl('', [Validators.maxLength(ValidationConstants.INPUT_LENGTH_256)]),
      type: new FormControl(null, Validators.required),
      ownership: new FormControl(null, Validators.required),
      institution: new FormControl('', Validators.required),
      coverImage: new FormControl(''),
      coverImageId: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.store.dispatch(new GetAllInstitutions(true));
    this.provider && this.activateEditMode();
    this.passInfoFormGroup.emit(this.InfoFormGroup);
  }

  compareInstitutions(institution1: Institution, institution2: Institution): boolean {
    return institution1.id === institution2.id;
  }

  /**
   * This method fills inputs with information of edited provider
   */
  private activateEditMode(): void {
    this.InfoFormGroup.patchValue(this.provider, { emitEvent: false });
    if (this.provider.coverImageId) {
      this.InfoFormGroup.get('coverImageId').setValue([this.provider.coverImageId], { emitEvent: false });
    }
  }
}
