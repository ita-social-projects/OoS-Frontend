import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { CreateWorkshopAddressComponent } from './create-workshop-address.component';

describe('CreateWorkshopAddressComponent', () => {
  let component: CreateWorkshopAddressComponent;
  let fixture: ComponentFixture<CreateWorkshopAddressComponent>;

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
      declarations: [CreateWorkshopAddressComponent, MockMapComponent, MockAddressFormComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateWorkshopAddressComponent);
    component = fixture.componentInstance;
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
    expect(component.socialTypesKeys()).toEqual(Object.keys(SocialNetworks));
  });

  it('should set the step value', () => {
    component.setStep(3);
    expect(component.step).toBe(3);
  });

  it('should increment the step value', () => {
    component.setStep(2);
    component.nextStep();
    expect(component.step).toBe(3);
  });

  it('should decrement the step value', () => {
    component.setStep(2);
    component.prevStep();
    expect(component.step).toBe(1);
  });

  it('should delete a form field', () => {
    const formArray = new FormArray([new FormControl('test1'), new FormControl('test2')]);
    component.deleteFormField(formArray, 0);
    expect(formArray.length).toBe(1);
  });

  it('should delete an address form and update the step', () => {
    component.addressesFormArray = new FormArray([new FormGroup({}), new FormGroup({})]);
    component.deleteAddressForm(0);
    expect(component.addressesFormArray.length).toBe(1);
    expect(component.step).toBe(0);
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
    const socialForm = component.createSocialNetworksFormGroup();
    expect(socialForm.get('type')).toBeTruthy();
    expect(socialForm.get('url')).toBeTruthy();
  });

  it('should create an email form group', () => {
    const emailGroup = component.createEmailFormGroup();
    expect(emailGroup instanceof FormGroup).toBeTruthy();
    expect(emailGroup.controls.type).toBeDefined();
    expect(emailGroup.controls.address).toBeDefined();
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
