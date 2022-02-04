import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Constants } from 'src/app/shared/constants/constants';
import { OwnershipType, OwnershipTypeUkr, ProviderType, ProviderTypeUkr } from 'src/app/shared/enum/provider';
import { Provider } from 'src/app/shared/models/provider.model';
import { TEXT_REGEX } from 'src/app/shared/constants/regex-constants';

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
  today: Date = new Date();

  @Input() provider: Provider;
  @Output() passInfoFormGroup = new EventEmitter();

  constructor(private formBuilder: FormBuilder) {
    this.InfoFormGroup = this.formBuilder.group({
      fullTitle: new FormControl('', Validators.required),
      shortTitle: new FormControl('', Validators.required),
      edrpouIpn: new FormControl('', [Validators.required, Validators.minLength(8)]),
      director: new FormControl('', [Validators.required, Validators.pattern(TEXT_REGEX)]),
      directorDateOfBirth: new FormControl('', Validators.required),
      phoneNumber: new FormControl('', [Validators.required, Validators.minLength(Constants.PHONE_LENGTH)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      website: new FormControl(''),
      facebook: new FormControl(''),
      instagram: new FormControl(''),
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
