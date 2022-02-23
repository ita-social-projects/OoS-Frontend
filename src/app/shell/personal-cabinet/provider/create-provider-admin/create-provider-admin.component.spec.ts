import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';
import { Workshop } from 'src/app/shared/models/workshop.model';

import { CreateProviderAdminComponent } from './create-provider-admin.component';

describe('CreateProviderAdminComponent', () => {
  let component: CreateProviderAdminComponent;
  let fixture: ComponentFixture<CreateProviderAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        // MatAutocompleteModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        NgxsModule.forRoot([]),
      ],
      declarations: [ 
        CreateProviderAdminComponent,
        MockValidationHintForInputComponent,
        MockWorkshopChekcboxDropdownComponent
       ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProviderAdminComponent);
    component = fixture.componentInstance;
    component.ProviderAdminFormGroup = new FormGroup({
      lastName: new FormControl(''),
      middleName: new FormControl(''),
      firstName: new FormControl(''),
      phoneNumber: new FormControl(),
      email: new FormControl(),
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

@Component({
  selector: 'app-validation-hint-for-input',
  template: ''
})

class MockValidationHintForInputComponent {
  @Input() type: string;
  @Input() invalid: boolean;
  @Input() isEmailCheck: boolean;
  @Input() isEmptyCheck: boolean;
  @Input() minLength: boolean;
  @Input() maxLength: boolean;
  @Input() minCharachters: number;
  @Input() maxCharachters: number; 
  @Input() forbiddenCharacter: string;
}

@Component({
  selector: 'app-workshop-checkbox-dropdown',
  template: ''
})

class MockWorkshopChekcboxDropdownComponent {
  @Input() workshops: Workshop[];
}