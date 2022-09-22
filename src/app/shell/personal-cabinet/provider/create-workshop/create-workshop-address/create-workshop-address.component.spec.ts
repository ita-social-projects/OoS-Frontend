import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateWorkshopAddressComponent } from './create-workshop-address.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxsModule } from '@ngxs/store';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Component, Input } from '@angular/core';
import { Workshop } from 'src/app/shared/models/workshop.model';
import { Address } from 'src/app/shared/models/address.model';

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
        BrowserAnimationsModule
      ],
      declarations: [
        CreateWorkshopAddressComponent,
        MockMapComponent,
        MockAddressForm
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateWorkshopAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

@Component({
  selector: 'app-map',
  template: ''
})
class MockMapComponent {
  @Input() addressFormGroup: FormGroup;
}
@Component({
  selector: 'app-create-address-form',
  template: '',
})
class MockAddressForm {
  @Input() addressFormGroup: FormGroup;
  @Input() settelmentFormGroup: FormGroup;
  @Input() address: Address;
}