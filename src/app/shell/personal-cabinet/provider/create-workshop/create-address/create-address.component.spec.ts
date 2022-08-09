import { ValidationHintComponent } from './../../../../../shared/components/validation-hint/validation-hint.component';
import { City } from 'src/app/shared/models/city.model';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateAddressComponent } from './create-address.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxsModule } from '@ngxs/store';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Component, Input } from '@angular/core';
import { Workshop } from 'src/app/shared/models/workshop.model';

describe('CreateAddressComponent', () => {
  let component: CreateAddressComponent;
  let fixture: ComponentFixture<CreateAddressComponent>;

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
        CreateAddressComponent,
        MockMapComponent,
        ValidationHintComponent,
        MockCityAutocompleteComponent
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAddressComponent);
    component = fixture.componentInstance;
    component.addressFormGroup = new FormGroup({
      street: new FormControl(''),
      buildingNumber: new FormControl(''),
      city: new FormControl(''),
      longitude: new FormControl(''),
    });
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
  @Input() isCreateWorkShops: boolean;
  @Input() workshops: Workshop[];
}
@Component({
  selector: 'app-city-autocomplete',
  template: ''
})
class MockCityAutocompleteComponent {
  @Input() InitialCity: string;
  @Input() className: string;
  @Input() cityFormControl: FormControl;
}
