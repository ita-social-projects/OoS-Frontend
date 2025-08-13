import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxsModule } from '@ngxs/store';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Component, Input } from '@angular/core';
import { Address } from 'shared/models/address.model';
import { TranslateModule } from '@ngx-translate/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SocialNetworks } from 'shared/enum/workshop';
import { Contacts } from 'shared/models/workshop.model';
import { Geocoder } from 'shared/models/geolocation';
import { CreateContactsComponent } from './create-contacts.component';

describe('CreateContactsComponent', () => {
  let component: CreateContactsComponent;
  let fixture: ComponentFixture<CreateContactsComponent>;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        MatFormFieldModule,
        NgxsModule.forRoot([]),
        MatInputModule,
        MatCheckboxModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot()
      ],
      declarations: [CreateContactsComponent, MockMapComponent, MockAddressFormComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateContactsComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add a new phone field to the contact form', () => {
    const contactForm = new FormGroup({
      phones: new FormArray([])
    });

    component.addPhoneField(contactForm);

    expect((contactForm.get('phones') as FormArray).length).toBe(1);
  });

  it('should call updateValueAndValidity after adding a phone field', () => {
    const contactForm = new FormGroup({
      phones: new FormArray([])
    });
    const phonesArray = contactForm.get('phones') as FormArray;
    jest.spyOn(phonesArray, 'updateValueAndValidity');

    component.addPhoneField(contactForm);

    expect(phonesArray.updateValueAndValidity).toHaveBeenCalledTimes(1);
  });

  it('should return socialTypes keys', () => {
    component.socialTypes = SocialNetworks;

    expect(component.socialTypesKeys).toEqual(Object.keys(SocialNetworks));
  });

  it('should set the step value', () => {
    component.setStep(3);

    expect(component.stepIndex).toBe(3);
  });

  it('should increment the step value', () => {
    component.setStep(2);
    component.nextStep();

    expect(component.stepIndex).toBe(3);
  });

  it('should decrement the step value', () => {
    component.setStep(2);
    component.prevStep();

    expect(component.stepIndex).toBe(1);
  });

  it('should delete a form field', () => {
    const formArray = new FormArray([new FormControl('test1'), new FormControl('test2')]);
    const deleteFormFieldSpy = jest.spyOn(component as any, 'deleteFormField');

    (component as any).deleteFormField(formArray, 0);

    expect(deleteFormFieldSpy).toHaveBeenCalledWith(formArray, 0);
    expect(formArray.length).toBe(1);
  });

  it('should delete an address form and update the step', () => {
    component.addressesFormArray = new FormArray([new FormGroup({}), new FormGroup({})]);
    const event = new MouseEvent('click');

    (component as any).deleteAddressForm(0, event);

    expect(component.addressesFormArray.length).toBe(1);
    expect(component.stepIndex).toBe(0);
  });

  it('should update isDefault values correctly', () => {
    const address1 = new FormGroup({ isDefault: new FormControl(false) });
    const address2 = new FormGroup({ isDefault: new FormControl(true) });
    component.addressesFormArray = new FormArray([address1, address2]);

    component.onIsDefaultChange(address1, true);

    expect(address1.get('isDefault').value).toBe(true);
    expect(address2.get('isDefault').value).toBe(false);
  });

  it('should create a social networks form group', () => {
    const socialForm = (component as any).createSocialNetworksFormGroup();

    expect(socialForm.get('type')).toBeTruthy();
    expect(socialForm.get('url')).toBeTruthy();
  });

  it('should create an email form group', () => {
    const emailGroup = (component as any).createEmailFormGroup();

    expect(emailGroup instanceof FormGroup).toBeTruthy();
    expect(emailGroup.controls.type).toBeDefined();
    expect(emailGroup.controls.address).toBeDefined();
  });

  it('should add an email field', () => {
    const contact = new FormGroup({ emails: new FormArray([]) });

    component.addEmailField(contact);

    expect((contact.get('emails') as FormArray).length).toBe(1);
  });

  it('should add a social network field', () => {
    const contact = new FormGroup({ socialNetworks: new FormArray([]) });

    component.addSocialsField(contact);

    expect((contact.get('socialNetworks') as FormArray).length).toBe(1);
  });

  it('should add an address group', () => {
    component.addressesFormArray = new FormArray([]);

    component.addAddressGroup();

    expect(component.addressesFormArray.length).toBe(1);
  });

  it('should activate edit mode', () => {
    const contact = { title: 'Test' } as Contacts;
    const contactFormGroup = formBuilder.group({ title: '' });

    component.activateEditMode(contactFormGroup, contact);

    expect(contactFormGroup.get('title').value).toBe('Test');
  });

  describe('onAddressSelect', () => {
    let addressGroup: FormGroup;

    beforeEach(() => {
      addressGroup = formBuilder.group({
        address: new FormGroup({
          buildingNumber: new FormControl(''),
          catottgId: new FormControl(''),
          street: new FormControl(''),
          latitude: new FormControl(''),
          longitude: new FormControl('')
        }),
        searchGroup: new FormGroup({
          settlement: new FormControl(''),
          settlementSearch: new FormControl('')
        })
      });
    });

    it('should set noAddressFound to true and set error when result is null', () => {
      component.onAddressSelect(null, addressGroup);

      expect(component.noAddressFound).toBeTruthy();
      expect(addressGroup.get('address').errors).toEqual({ noAddressFound: true });
    });

    it('should patch address fields when result is provided without codeficator', () => {
      const result: Geocoder = {
        buildingNumber: '123',
        catottgId: 456,
        street: 'Main Street',
        lat: 50.123,
        lon: 30.456
      };

      component.onAddressSelect(result, addressGroup);

      expect(component.noAddressFound).toBeFalsy();
      expect(addressGroup.get('address').value).toEqual({
        buildingNumber: '123',
        catottgId: 456,
        street: 'Main Street',
        latitude: 50.123,
        longitude: 30.456
      });
    });
  });

  it('should initialize addressesFormArray correctly', () => {
    component.contacts = [{}, {}] as any;

    component.ngOnInit();

    expect(component.addressesFormArray.length).toBe(2);
  });

  it('should initialize addressesFormArray with one form group if no contacts', () => {
    component.contacts = null;

    component.ngOnInit();

    expect(component.addressesFormArray.length).toBe(1);
  });
});

@Component({
  selector: 'app-map',
  template: ''
})
class MockMapComponent {
  @Input() addressFormGroup: FormGroup;
  @Input() settelmentFormGroup: FormGroup;
}

@Component({
  selector: 'app-create-address-form',
  template: ''
})
class MockAddressFormComponent {
  @Input() addressFormGroup: FormGroup;
  @Input() searchFormGroup: FormGroup;
  @Input() address: Address;
}
