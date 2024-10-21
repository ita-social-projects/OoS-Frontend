import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { MUST_CONTAIN_LETTERS } from 'shared/constants/regex-constants';

import { FormValidators, ValidationConstants } from 'shared/constants/validation';
import { Address } from 'shared/models/address.model';
import { Geocoder } from 'shared/models/geolocation';

@Component({
  selector: 'app-create-workshop-address',
  templateUrl: './create-workshop-address.component.html',
  styleUrls: ['./create-workshop-address.component.scss']
})
export class CreateWorkshopAddressComponent implements OnInit, OnDestroy {
  @Input() public address: Address;

  @Output() public passAddressFormGroup = new EventEmitter();

  public readonly validationConstants = ValidationConstants;

  public addressFormGroup: FormGroup;
  public searchFormGroup: FormGroup;
  public addressesFormArray: FormArray;
  public noAddressFound = false;
  public step = 0;

  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private formBuilder: FormBuilder) {}

  public get settlementFormControl(): FormControl {
    return this.searchFormGroup.get('settlement') as FormControl;
  }

  public get settlementSearchFormControl(): FormControl {
    return this.searchFormGroup.get('settlementSearch') as FormControl;
  }

  public setStep(index: number): void {
    this.step = index;
  }

  public nextStep(): void {
    this.step++;
  }

  public prevStep(): void {
    this.step--;
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public ngOnInit(): void {
    this.addressFormGroup = this.formBuilder.group({
      street: new FormControl('', FormValidators.defaultStreetValidators),
      buildingNumber: new FormControl('', FormValidators.defaultHouseValidators),
      catottgId: new FormControl('', Validators.required),
      latitude: new FormControl(''),
      longitude: new FormControl('')
    });
    this.searchFormGroup = this.formBuilder.group({
      settlementSearch: new FormControl('', FormValidators.defaultSearchValidators),
      settlement: new FormControl('')
    });
    this.addressesFormArray = this.formBuilder.array([this.createAddressFormGroup()]);
    this.passAddressFormGroup.emit(this.addressFormGroup);
  }

  public onAddressSelect(result: Geocoder): void {
    this.noAddressFound = !result;
    if (result) {
      this.addressFormGroup.patchValue(
        {
          latitude: result.lat,
          longitude: result.lon
        },
        { emitEvent: false }
      );
      if (result.codeficator) {
        this.settlementFormControl.setValue(result.codeficator, { emitEvent: false });
        this.settlementSearchFormControl.setValue(result.codeficator.settlement, { emitEvent: false });
        this.markFormAsDirtyOnUserInteraction();
      }
    } else {
      this.addressFormGroup.setErrors({ noAddressFound: true });
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

  public createAddressFormGroup(): FormGroup {
    return this.formBuilder.group({
      addressTitle: [
        '',
        [
          Validators.required,
          Validators.minLength(ValidationConstants.INPUT_LENGTH_3),
          Validators.maxLength(ValidationConstants.INPUT_LENGTH_60),
          Validators.pattern(MUST_CONTAIN_LETTERS)
        ]
      ],
      searchGroup: this.createSearchFormGroup(),
      address: this.createAddressForm(),
      website: ['', Validators.maxLength(ValidationConstants.INPUT_LENGTH_256)],
      facebook: ['', Validators.maxLength(ValidationConstants.INPUT_LENGTH_256)],
      instagram: ['', Validators.maxLength(ValidationConstants.INPUT_LENGTH_256)],
      contacts: this.formBuilder.array([this.createContactsFormGroup()])
    });
  }

  public createContactsFormGroup(): FormGroup {
    return this.formBuilder.group({
      type: [
        '',
        [
          Validators.required,
          Validators.minLength(ValidationConstants.INPUT_LENGTH_3),
          Validators.maxLength(ValidationConstants.INPUT_LENGTH_60),
          Validators.pattern(MUST_CONTAIN_LETTERS)
        ]
      ],
      phoneList: this.formBuilder.array([this.createPhoneFormGroup()]),
      emailList: this.formBuilder.array([this.createEmailFormGroup()])
    });
  }

  public addPhoneField(contact: FormGroup): void {
    const phoneGroup = this.createPhoneFormGroup();
    (contact.get('phoneList') as FormArray).controls.push(phoneGroup);
    (contact.get('phoneList') as FormArray).updateValueAndValidity();
    phoneGroup.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      (contact.get('phoneList') as FormArray).updateValueAndValidity();
    });
  }

  public addEmailField(contact: FormGroup): void {
    const emailGroup = this.createEmailFormGroup();
    (contact.get('emailList') as FormArray).controls.push(emailGroup);
    (contact.get('emailList') as FormArray).updateValueAndValidity();
    emailGroup.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      (contact.get('emailList') as FormArray).updateValueAndValidity();
    });
  }

  public addContactsForm(address: FormGroup): void {
    const contactsForm = this.createContactsFormGroup();
    (address.get('contacts') as FormArray).controls.push(contactsForm);
    (address.get('contacts') as FormArray).updateValueAndValidity();
    contactsForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      (address.get('contacts') as FormArray).updateValueAndValidity();
    });
  }

  public addAddressGroup(): void {
    const addressGroup = this.createAddressFormGroup();
    this.addressesFormArray.controls.push(addressGroup);
    this.addressesFormArray.updateValueAndValidity();
    addressGroup.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.addressesFormArray.updateValueAndValidity();
    });
    this.setStep(this.addressesFormArray.controls.length - 1);
  }

  public createPhoneFormGroup(): FormGroup {
    return this.formBuilder.group({
      phone: ['', [Validators.required, Validators.minLength(ValidationConstants.PHONE_LENGTH)]]
    });
  }

  public createEmailFormGroup(): FormGroup {
    return this.formBuilder.group({
      email: ['', [Validators.required, FormValidators.email]]
    });
  }

  public createAddressForm(): FormGroup {
    return this.formBuilder.group({
      street: new FormControl('', FormValidators.defaultStreetValidators),
      buildingNumber: new FormControl('', FormValidators.defaultHouseValidators),
      catottgId: new FormControl('', Validators.required),
      latitude: new FormControl(''),
      longitude: new FormControl('')
    });
  }

  public createSearchFormGroup(): FormGroup {
    return this.formBuilder.group({
      settlementSearch: new FormControl('', FormValidators.defaultSearchValidators),
      settlement: new FormControl('')
    });
  }

  public deletePhoneField(phoneGroup: FormArray, index: number): void {
    (phoneGroup.get('phoneList') as FormArray).removeAt(index);
  }

  public deleteEmailField(phoneGroup: FormArray, index: number): void {
    (phoneGroup.get('emailList') as FormArray).removeAt(index);
  }
}
