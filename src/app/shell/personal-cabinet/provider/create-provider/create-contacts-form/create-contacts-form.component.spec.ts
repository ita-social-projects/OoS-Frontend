import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateContactsFormComponent } from './create-contacts-form.component';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';

import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Component, Input } from '@angular/core';

describe('CreateContactsFormComponent', () => {
  let component: CreateContactsFormComponent;
  let fixture: ComponentFixture<CreateContactsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule,
        MatCheckboxModule
      ],
      declarations: [
        CreateContactsFormComponent,
        MockValidationHintForInputComponent,
        MockCityAutocompleteComponent
      ]
    })
      .compileComponents();
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
  selector: 'app-validation-hint',
  template: ''
})

class MockValidationHintForInputComponent{
  @Input() validationFormControl: FormControl; 
  @Input() minCharachters: number;
  @Input() maxCharachters: number;
  @Input() minMaxDate: boolean;
  @Input() isTouched: boolean;
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