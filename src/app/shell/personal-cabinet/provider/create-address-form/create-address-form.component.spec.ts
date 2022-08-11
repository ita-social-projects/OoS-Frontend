import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { CreateAddressFormComponent } from './create-address-form.component';
import { MatFormFieldModule } from '@angular/material/form-field';

fdescribe('CreateAddressFormComponent', () => {
  let component: CreateAddressFormComponent;
  let fixture: ComponentFixture<CreateAddressFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatFormFieldModule, 
        MatOptionModule, 
        MatInputModule, 
        MatAutocompleteModule, 
        ReactiveFormsModule
      ],
      declarations: [
        CreateAddressFormComponent, 
        MockValidationHintForInputComponent, 
        MockCityAutocompleteComponent
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAddressFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

@Component({
  selector: 'app-validation-hint',
  template: '',
})
class MockValidationHintForInputComponent {
  @Input() validationFormControl: FormControl;
  @Input() minCharachters: number;
  @Input() maxCharachters: number;
  @Input() minMaxDate: boolean;
  @Input() isTouched: boolean;
}
@Component({
  selector: 'app-city-autocomplete',
  template: '',
})
class MockCityAutocompleteComponent {
  @Input() InitialCity: string;
  @Input() className: string;
  @Input() cityFormControl: FormControl;
}
