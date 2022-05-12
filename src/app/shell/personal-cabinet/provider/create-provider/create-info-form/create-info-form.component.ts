import { ValidationConstants, ValidationTextField } from './../../../../../shared/constants/validation';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Constants } from 'src/app/shared/constants/constants';
import { OwnershipType, OwnershipTypeUkr, ProviderType, ProviderTypeUkr } from 'src/app/shared/enum/provider';
import { Provider } from 'src/app/shared/models/provider.model';
import { DATE_REGEX, EDRPOUIPN_REGEX, TEXT_REGEX, WEB_INST_FB_REGEX } from 'src/app/shared/constants/regex-constants';
import { Util } from 'src/app/shared/utils/utils';

@Component({
  selector: 'app-create-info-form',
  templateUrl: './create-info-form.component.html',
  styleUrls: ['./create-info-form.component.scss']
})
export class CreateInfoFormComponent implements OnInit {
  readonly dateFormPlaceholder = Constants.DATE_FORMAT_PLACEHOLDER;
  readonly phonePrefix= Constants.PHONE_PREFIX;

  readonly validationConstants = ValidationConstants;
  readonly validationTextField = ValidationTextField;

  readonly ownershipType = OwnershipType;
  readonly providerType = ProviderType;

  readonly ownershipTypeUkr = OwnershipTypeUkr;
  readonly providerTypeUkr = ProviderTypeUkr;

  InfoFormGroup: FormGroup;

  @Input() provider: Provider;
  @Output() passInfoFormGroup = new EventEmitter();

  dateFilter: RegExp = DATE_REGEX;
  maxDate: Date = Util.getMaxBirthDate();
  minDate: Date = Util.getMinBirthDate(Constants.BIRTH_AGE_MAX);

  constructor(private formBuilder: FormBuilder) {
    this.InfoFormGroup = this.formBuilder.group({
      fullTitle: new FormControl('', [
        Validators.required, 
        Validators.pattern(TEXT_REGEX),
        Validators.minLength(ValidationConstants.INPUT_LENGTH_1),
        Validators.maxLength(ValidationConstants.INPUT_LENGTH_60)
      ]),
      shortTitle: new FormControl('', [
        Validators.required, 
        Validators.pattern(TEXT_REGEX),
        Validators.minLength(ValidationConstants.INPUT_LENGTH_1),
        Validators.maxLength(ValidationConstants.INPUT_LENGTH_60)
      ]),
      edrpouIpn: new FormControl('', [
        Validators.required, 
        Validators.pattern(EDRPOUIPN_REGEX),
        Validators.minLength(ValidationConstants.INPUT_LENGTH_8),
        Validators.maxLength(ValidationConstants.INPUT_LENGTH_10)
      ]),
      director: new FormControl('', [
        Validators.required, 
        Validators.pattern(TEXT_REGEX),
        Validators.minLength(ValidationConstants.INPUT_LENGTH_1),
        Validators.maxLength(ValidationConstants.INPUT_LENGTH_50) 
      ]),
      directorDateOfBirth: new FormControl('', Validators.required),
      phoneNumber: new FormControl('', [Validators.required, 
        Validators.minLength(Constants.PHONE_LENGTH),
        Validators.maxLength(Constants.PHONE_LENGTH),
      ]),
      email: new FormControl('', [
        Validators.required, 
        Validators.email
      ]),
      website: new FormControl('', [
        Validators.pattern(WEB_INST_FB_REGEX),
        Validators.maxLength(ValidationConstants.INPUT_LENGTH_256) 
      ]),
      facebook: new FormControl('', [
        Validators.pattern(WEB_INST_FB_REGEX),
        Validators.maxLength(ValidationConstants.INPUT_LENGTH_256) 
      ]),
      instagram: new FormControl('', [
        Validators.pattern(WEB_INST_FB_REGEX),
        Validators.maxLength(ValidationConstants.INPUT_LENGTH_256) 
      ]),
      founder: new FormControl('', [
        Validators.required, 
        Validators.pattern(TEXT_REGEX),
        Validators.minLength(ValidationConstants.INPUT_LENGTH_1),
        Validators.maxLength(ValidationConstants.INPUT_LENGTH_60)
      ]),
      type: new FormControl(null, Validators.required),
      ownership: new FormControl(null, Validators.required),
    });
  }

  ngOnInit(): void {
    (this.provider) && this.InfoFormGroup.patchValue(this.provider, { emitEvent: false });
    this.passInfoFormGroup.emit(this.InfoFormGroup);
  }

}
