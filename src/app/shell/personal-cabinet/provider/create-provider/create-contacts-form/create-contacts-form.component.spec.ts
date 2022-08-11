import { Component, Input} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CreateContactsFormComponent } from './create-contacts-form.component';
import { NgxsModule } from '@ngxs/store';
import { Address } from 'src/app/shared/models/address.model';

describe('CreateContactsFormComponent', () => {
  let component: CreateContactsFormComponent;
  let fixture: ComponentFixture<CreateContactsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule, 
        FormsModule, 
        MatCheckboxModule, 
        NgxsModule.forRoot([]), 
        ReactiveFormsModule
      ],
      declarations: [CreateContactsFormComponent, MockAddressForm],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateContactsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

@Component({
  selector: 'app-create-address-form',
  template: '',
})
class MockAddressForm {
  @Input() addressFormGroup: FormGroup;
  @Input() searchFormGroup: FormGroup;
  @Input() address: Address;
}
