import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { MUST_CONTAIN_LETTERS } from 'shared/constants/regex-constants';

import { FormValidators, ValidationConstants } from 'shared/constants/validation';
import { SocialNetworks } from 'shared/enum/workshop';
import { Address } from 'shared/models/address.model';
import { CompetitionContacts } from 'shared/models/competition.model';
import { Geocoder } from 'shared/models/geolocation';

@Component({
  selector: 'app-create-competition-address',
  templateUrl: './create-competition-address.component.html',
  styleUrls: ['./create-competition-address.component.scss']
})
export class CreateCompetitionAddressComponent implements OnInit, OnDestroy {
  // @Input() public address: Address;
  @Input() public contacts: CompetitionContacts[];

  @Output() public passContactsFormArray = new EventEmitter();

  public readonly validationConstants = ValidationConstants;

  public addressFormGroup: FormGroup;
  public searchFormGroup: FormGroup;
  public addressesFormArray: FormArray;
  public noAddressFound = false;
  public stepIndex = 0;
  public socialTypes = SocialNetworks;
  public socialTypesKeys = Object.keys(this.socialTypes);

  public destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private formBuilder: FormBuilder) {}

  public get settlementFormControl(): FormControl {
    return this.searchFormGroup.get('settlement') as FormControl;
  }

  public get settlementSearchFormControl(): FormControl {
    return this.searchFormGroup.get('settlementSearch') as FormControl;
  }

  public setStep(index: number): void {
    this.stepIndex = index;
  }

  public ngOnInit(): void {
    this.addressesFormArray = this.formBuilder.array([]);
    if (this.contacts) {
      this.contacts.forEach((contact) => {
        this.addAddressGroup(contact);
      });
    } else {
      this.addressesFormArray = this.formBuilder.array([this.createAddressFormGroup()]);
    }
    this.passContactsFormArray.emit(this.addressesFormArray);
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public onAddressSelect(result: Geocoder, addressGroup: FormGroup): void {
    this.noAddressFound = !result;
    if (result) {
      addressGroup.get('address').patchValue(
        {
          buildingNumber: result.buildingNumber,
          catottgId: result.catottgId,
          street: result.street,
          latitude: result.lat,
          longitude: result.lon
        },
        { emitEvent: false }
      );
      if (result.codeficator) {
        addressGroup.get('searchGroup').get('settlement').setValue(result.codeficator, { emitEvent: false });
        addressGroup.get('searchGroup').get('settlementSearch').setValue(result.codeficator.settlement, { emitEvent: false });
        this.markFormAsDirtyOnUserInteraction();
      }
    } else {
      addressGroup.get('address').setErrors({ noAddressFound: true });
    }
  }

  /**
   * This method makes addressFormGroup dirty
   */
  public markFormAsDirtyOnUserInteraction(): void {
    if (!this.addressFormGroup.dirty) {
      this.addressFormGroup.markAsDirty({ onlySelf: true });
    }
  }

  public createAddressFormGroup(address?: CompetitionContacts): FormGroup {
    const contactFormGroup = this.formBuilder.group({
      title: [
        '',
        [
          Validators.required,
          Validators.minLength(ValidationConstants.INPUT_LENGTH_3),
          Validators.maxLength(ValidationConstants.INPUT_LENGTH_60),
          Validators.pattern(MUST_CONTAIN_LETTERS)
        ]
      ],
      isDefault: false,
      searchGroup: this.createSearchFormGroup(),
      address: this.createAddressForm(),
      phones: this.formBuilder.array([this.createPhoneFormGroup()]),
      emails: this.formBuilder.array([this.createEmailFormGroup()]),
      socialNetworks: this.formBuilder.array([])
    });

    if (address) {
      this.activateEditMode(contactFormGroup, address);
    }

    const isDefaultFormControl = contactFormGroup.get('isDefault');
    isDefaultFormControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.onIsDefaultChange(contactFormGroup, isDefaultFormControl.value);
    });

    return contactFormGroup;
  }

  public activateEditMode(contactsFormGroup: FormGroup, contact: CompetitionContacts): void {
    contactsFormGroup.patchValue(contact, { emitEvent: false });
  }

  public addPhoneField(contact: FormGroup): void {
    this.addFormField(contact, 'phones', () => this.createPhoneFormGroup());
  }

  public addEmailField(contact: FormGroup): void {
    this.addFormField(contact, 'emails', () => this.createEmailFormGroup());
  }

  public addSocialsField(contact: FormGroup): void {
    this.addFormField(contact, 'socialNetworks', () => this.createSocialNetworksFormGroup());
  }

  public addAddressGroup(contact?: CompetitionContacts): void {
    const addressGroup = this.createAddressFormGroup(contact);
    this.addressesFormArray.controls.push(addressGroup);
    this.addressesFormArray.updateValueAndValidity();
    addressGroup.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.addressesFormArray.updateValueAndValidity();
    });
    this.setStep(this.addressesFormArray.controls.length - 1);
  }

  public onIsDefaultChange(addressGroup: FormGroup, checked: boolean): void {
    if (checked) {
      this.addressesFormArray.controls.forEach((formGroup: FormGroup) => {
        formGroup.get('isDefault').patchValue(false, { emitEvent: false });
      });
      addressGroup.get('isDefault').patchValue(true, { emitEvent: false });
    }
  }

  private addFormField<T extends FormGroup>(contact: FormGroup, arrayName: string, createFormGroup: () => T): void {
    const formGroup = createFormGroup();
    const formArray = contact.get(arrayName) as FormArray;
    formArray.controls.push(formGroup);
    formArray.updateValueAndValidity();
    formGroup.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      formArray.updateValueAndValidity();
    });
  }

  private createPhoneFormGroup(): FormGroup {
    return this.formBuilder.group({
      type: new FormControl('', [Validators.required, Validators.minLength(ValidationConstants.INPUT_LENGTH_3)]),
      number: new FormControl('', [Validators.required, Validators.minLength(ValidationConstants.PHONE_LENGTH)])
    });
  }

  private createEmailFormGroup(): FormGroup {
    return this.formBuilder.group({
      type: new FormControl('', [Validators.required, Validators.minLength(ValidationConstants.INPUT_LENGTH_3)]),
      address: new FormControl('', [Validators.required, FormValidators.email])
    });
  }

  private createSocialNetworksFormGroup(): FormGroup {
    return this.formBuilder.group({
      type: new FormControl('', [Validators.minLength(ValidationConstants.INPUT_LENGTH_3)]),
      url: new FormControl('', [Validators.pattern('^https?://[\\w\\d.-]+\\.[a-z]{2,}(?:/.*)?$')])
    });
  }

  private createAddressForm(): FormGroup {
    return this.formBuilder.group({
      street: new FormControl('', FormValidators.defaultStreetValidators),
      buildingNumber: new FormControl('', FormValidators.defaultHouseValidators),
      catottgId: new FormControl('', Validators.required),
      latitude: new FormControl(''),
      longitude: new FormControl('')
    });
  }

  private createSearchFormGroup(): FormGroup {
    return this.formBuilder.group({
      settlementSearch: new FormControl('', FormValidators.defaultSearchValidators),
      settlement: new FormControl('')
    });
  }
}
