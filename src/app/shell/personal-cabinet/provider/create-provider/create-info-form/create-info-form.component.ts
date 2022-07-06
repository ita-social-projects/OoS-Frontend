import { ValidationConstants } from 'src/app/shared/constants/validation';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Constants, CropperConfigurationConstants } from 'src/app/shared/constants/constants';
import { OwnershipType, OwnershipTypeUkr, ProviderType, ProviderTypeUkr } from 'src/app/shared/enum/provider';
import { Provider } from 'src/app/shared/models/provider.model';
import { DATE_REGEX, NAME_REGEX } from 'src/app/shared/constants/regex-constants';
import { Util } from 'src/app/shared/utils/utils';
import { MetaDataState } from 'src/app/shared/store/meta-data.state';
import { Select, Store } from '@ngxs/store';
import { Institution } from 'src/app/shared/models/institution.model';
import { Observable } from 'rxjs';
import { GetAllInstitutions } from 'src/app/shared/store/meta-data.actions';

@Component({
  selector: 'app-create-info-form',
  templateUrl: './create-info-form.component.html',
  styleUrls: ['./create-info-form.component.scss']
})
export class CreateInfoFormComponent implements OnInit {
  readonly validationConstants = ValidationConstants;
  readonly dateFormPlaceholder = Constants.DATE_FORMAT_PLACEHOLDER;
  readonly mailFormPlaceholder = Constants.MAIL_FORMAT_PLACEHOLDER;
  readonly phonePrefix= Constants.PHONE_PREFIX;
  readonly ownershipType = OwnershipType;
  readonly providerType = ProviderType;
  readonly ownershipTypeUkr = OwnershipTypeUkr;
  readonly providerTypeUkr = ProviderTypeUkr;
  readonly cropperConfig = {
    cropperMinWidth: CropperConfigurationConstants.cropperMinWidth,
    cropperMaxWidth: CropperConfigurationConstants.cropperMaxWidth,
    cropperMinHeight: CropperConfigurationConstants.cropperMinHeight,
    cropperMaxHeight: CropperConfigurationConstants.cropperMaxHeight,
    cropperAspectRatio: CropperConfigurationConstants.coverImageCropperAspectRatio
  }

  @Select(MetaDataState.institutions)
  institutions$: Observable<Institution[]>;

  @Input() provider: Provider;
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
      phoneNumber: new FormControl('', [
        Validators.required, 
        Validators.minLength(ValidationConstants.PHONE_LENGTH)
      ]),
      email: new FormControl('', [
        Validators.required, 
        Validators.email
      ]),
      website: new FormControl('', [
        Validators.maxLength(ValidationConstants.INPUT_LENGTH_256) 
      ]),
      facebook: new FormControl('', [
        Validators.maxLength(ValidationConstants.INPUT_LENGTH_256) 
      ]),
      instagram: new FormControl('', [
        Validators.maxLength(ValidationConstants.INPUT_LENGTH_256) 
      ]),
      type: new FormControl(null, Validators.required),
      ownership: new FormControl(null, Validators.required),
      institution: new FormControl('', Validators.required),
      coverImage: new FormControl(''),
      coverImageId: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.store.dispatch(new GetAllInstitutions());
    (this.provider) && this.InfoFormGroup.patchValue(this.provider, { emitEvent: false });
    this.passInfoFormGroup.emit(this.InfoFormGroup);
  }

  compareInstitutions(institution1: Institution, institution2: Institution): boolean {
    return institution1.id === institution2.id;
  }
}
