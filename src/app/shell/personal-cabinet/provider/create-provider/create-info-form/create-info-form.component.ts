import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Constants } from 'src/app/shared/constants/constants';
import { OwnershipType, OwnershipTypeUkr, ProviderType, ProviderTypeUkr } from 'src/app/shared/enum/provider';
import { Provider } from 'src/app/shared/models/provider.model';
import { DATE_REGEX, EDRPOUIPN_REGEX, TEXT_REGEX, TEXT_WITH_DIGITS_REGEX, WEB_INST_FB_REGEX } from 'src/app/shared/constants/regex-constants';
import { Util } from 'src/app/shared/utils/utils';

@Component({
  selector: 'app-create-info-form',
  templateUrl: './create-info-form.component.html',
  styleUrls: ['./create-info-form.component.scss']
})
export class CreateInfoFormComponent implements OnInit {

  readonly constants: typeof Constants = Constants;

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
      fullTitle: new FormControl('', Validators.required),
      shortTitle: new FormControl('', Validators.required),
      edrpouIpn: new FormControl('', [Validators.required, Validators.pattern(EDRPOUIPN_REGEX)]),
      director: new FormControl('', [Validators.required, Validators.pattern(TEXT_REGEX)]),
      directorDateOfBirth: new FormControl('', Validators.required),
      phoneNumber: new FormControl('', [Validators.required, Validators.minLength(Constants.PHONE_LENGTH)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      website: new FormControl('', [Validators.pattern(WEB_INST_FB_REGEX)]),
      facebook: new FormControl('', [Validators.pattern(WEB_INST_FB_REGEX)]),
      instagram: new FormControl('', [Validators.pattern(WEB_INST_FB_REGEX)]),
      founder: new FormControl('', [Validators.required, Validators.pattern(TEXT_REGEX)]),
      type: new FormControl(0, Validators.required),
      ownership: new FormControl(0, Validators.required),
    });
  }

  ngOnInit(): void {
    (this.provider) && this.InfoFormGroup.patchValue(this.provider, { emitEvent: false });
    this.passInfoFormGroup.emit(this.InfoFormGroup);
  }

}
