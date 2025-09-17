import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { MUST_CONTAIN_LETTERS, SOCIAL_NETWORK_LINK_REGEX } from 'shared/constants/regex-constants';

import { FormValidators, ValidationConstants } from 'shared/constants/validation';
import { Address } from 'shared/models/address.model';
import { Geocoder } from 'shared/models/geolocation';
import { SocialNetworks } from 'shared/enum/workshop';
import { Contacts } from 'shared/models/workshop.model';
import { BlacklistEmailValidator } from 'shared/validators/blacklist-email-validator';
import { Codeficator } from 'shared/models/codeficator.model';

@Component({
  selector: 'app-create-contacts',
  templateUrl: './create-contacts.component.html',
  styleUrls: ['./create-contacts.component.scss']
})
export class CreateContactsComponent implements OnInit, OnDestroy {
  @Input() public address: Address;
  @Input() public contacts: Contacts[];
  // Forbid address editing
  @Input() public moderatorFlow: boolean = false;
  @Output() public passContactsFormArray = new EventEmitter();

  public readonly validationConstants = ValidationConstants;

  public addressFormGroup: FormGroup;
  public searchFormGroup: FormGroup;
  public addressesFormArray: FormArray;
  public noAddressFound = false;
  public stepIndex = 0;
  public socialTypes = SocialNetworks;
  public socialTypesKeys = Object.keys(this.socialTypes);

  private destroy$: Subject<boolean> = new Subject<boolean>();

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

  public nextStep(): void {
    this.stepIndex++;
  }

  public prevStep(): void {
    this.stepIndex--;
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public ngOnInit(): void {
    this.addressesFormArray = this.formBuilder.array([]);
    if (this.contacts) {
      this.contacts.forEach((contact) => {
        this.addressesFormArray.push(this.createAddressFormGroup(contact));
      });
    } else {
      this.addressesFormArray = this.formBuilder.array([this.createAddressFormGroup()]);
    }
    this.passContactsFormArray.emit(this.addressesFormArray);
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
        { emitEvent: true }
      );
      if (result.codeficator) {
        addressGroup.get('searchGroup').get('settlement').setValue(result.codeficator, { emitEvent: true });
        addressGroup.get('searchGroup').get('settlementSearch').setValue(result.codeficator.settlement, { emitEvent: true });
        this.markFormAsDirtyOnUserInteraction();
      }
    } else {
      addressGroup.get('address').setErrors({ noAddressFound: true });
    }
  }

  public markFormAsDirtyOnUserInteraction(): void {
    if (!this.addressesFormArray.dirty) {
      this.addressesFormArray.markAsDirty({ onlySelf: true });
    }
  }

  public createAddressFormGroup(address?: Contacts): FormGroup {
    const contactFormGroup = this.formBuilder.group({
      title: [
        { value: '', disabled: this.moderatorFlow },
        [
          Validators.required,
          Validators.minLength(ValidationConstants.INPUT_LENGTH_3),
          Validators.maxLength(ValidationConstants.INPUT_LENGTH_60),
          Validators.pattern(MUST_CONTAIN_LETTERS)
        ]
      ],
      isDefault: false,
      searchGroup: this.createSearchFormGroup(address?.address?.codeficatorAddress),
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

  public activateEditMode(contactsFormGroup: FormGroup, contact: Contacts): void {
    this.updateFormArray('phones', contact.phones, () => this.createPhoneFormGroup(), contactsFormGroup);
    this.updateFormArray('emails', contact.emails, () => this.createEmailFormGroup(), contactsFormGroup);
    this.updateFormArray('socialNetworks', contact.socialNetworks, () => this.createSocialNetworksFormGroup(), contactsFormGroup);
    if (contactsFormGroup.get('searchGroup') && contact.address) {
      contactsFormGroup.get('searchGroup').get('settlement').setValue(contact.address.codeficatorAddress, { emitEvent: false });
      contactsFormGroup
        .get('searchGroup')
        .get('settlementSearch')
        .setValue(contact.address.codeficatorAddress?.settlement ?? '', {
          emitEvent: false
        });
    }
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

  public addAddressGroup(contact?: Contacts): void {
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

  private updateFormArray(formArrayKey: string, items: any[], createMethod: () => FormGroup, contactsFormGroup: FormGroup): void {
    const formArray = contactsFormGroup.get(formArrayKey) as FormArray;
    if (formArray && items) {
      while (formArray.length < items.length) {
        formArray.push(createMethod());
      }
    }
  }

  private addFormField<T extends FormGroup>(contact: FormGroup, arrayName: string, createFormGroup: () => T): void {
    const formGroup = createFormGroup();
    const formArray = contact.get(arrayName) as FormArray;
    formArray.push(formGroup);
    formArray.updateValueAndValidity();
    formGroup.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      formArray.updateValueAndValidity();
    });
  }

  private createPhoneFormGroup(): FormGroup {
    return this.overrideTouch(
      this.formBuilder.group({
        type: new FormControl('', [
          Validators.required,
          Validators.minLength(ValidationConstants.INPUT_LENGTH_3),
          Validators.maxLength(ValidationConstants.INPUT_LENGTH_60)
        ]),
        number: new FormControl('', [Validators.required, Validators.minLength(ValidationConstants.PHONE_LENGTH)])
      })
    );
  }

  private createEmailFormGroup(): FormGroup {
    return this.overrideTouch(
      this.formBuilder.group({
        type: new FormControl('', [
          Validators.required,
          Validators.minLength(ValidationConstants.INPUT_LENGTH_3),
          Validators.maxLength(ValidationConstants.INPUT_LENGTH_60)
        ]),
        address: new FormControl('', [
          Validators.required,
          FormValidators.email,
          Validators.maxLength(ValidationConstants.INPUT_LENGTH_254),
          BlacklistEmailValidator()
        ])
      })
    );
  }

  private createSocialNetworksFormGroup(): FormGroup {
    return this.overrideTouch(
      this.formBuilder.group({
        type: new FormControl('', [Validators.required, Validators.minLength(ValidationConstants.INPUT_LENGTH_3)]),
        url: new FormControl('', [
          Validators.required,
          Validators.pattern(SOCIAL_NETWORK_LINK_REGEX),
          Validators.maxLength(ValidationConstants.INPUT_LENGTH_2000)
        ])
      })
    );
  }

  private createAddressForm(): FormGroup {
    return this.overrideTouch(
      this.formBuilder.group({
        street: new FormControl({ value: '', disabled: this.moderatorFlow }, FormValidators.defaultStreetValidators),
        buildingNumber: new FormControl(
          {
            value: '',
            disabled: this.moderatorFlow
          },
          FormValidators.defaultHouseValidators
        ),
        catottgId: new FormControl({ value: '', disabled: this.moderatorFlow }, Validators.required),
        latitude: new FormControl({ value: '', disabled: this.moderatorFlow }),
        longitude: new FormControl({ value: '', disabled: this.moderatorFlow })
      })
    );
  }

  private createSearchFormGroup(codeficator?: Codeficator): FormGroup {
    return this.overrideTouch(
      this.formBuilder.group({
        settlementSearch: [
          {
            value: codeficator?.settlement || '',
            disabled: this.moderatorFlow
          },
          FormValidators.defaultSearchValidators
        ],
        settlement: [{ value: codeficator || '', disabled: this.moderatorFlow }]
      })
    );
  }

  private deleteFormField(fields: FormArray, index: number): void {
    fields.removeAt(index);
  }

  private deleteAddressForm(index: number, $event: Event): void {
    $event.stopPropagation();
    this.addressesFormArray.removeAt(index);
    this.stepIndex = this.addressesFormArray.length - 1;
  }

  // this method is made to get touch event for controls that were just added to array
  // TODO: rewrite/delete after migration to Angular 18+ due to changes for touch handling
  private overrideTouch(fb: FormGroup): FormGroup {
    Object.keys(fb.controls).forEach((key: string) => {
      const control = fb.get(key);
      const originalMethod = control.markAsTouched;
      control.markAsTouched = function (): void {
        originalMethod.apply(this, arguments);
        (control.statusChanges as EventEmitter<any>).emit();
      };
    });

    return fb;
  }
}
