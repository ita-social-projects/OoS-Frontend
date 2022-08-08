import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';
import { CreateProviderAdminComponent } from 'src/app/shell/personal-cabinet/provider/create-provider-admin/create-provider-admin.component';

import { CreateAdminComponent } from './create-admin.component';

describe('CreateAdminComponent', () => {
  let component: CreateAdminComponent;
  let fixture: ComponentFixture<CreateAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatStepperModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        MatDialogModule,
        CommonModule,
        NgxsModule.forRoot([]),
        RouterModule,
        FormsModule,
        MatSelectModule
      ],
      declarations: [ 
        CreateProviderAdminComponent,
        MockValidationHintForInputComponent
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAdminComponent);
    component = fixture.componentInstance;
    component.AdminFormGroup = new FormGroup({
      lastName: new FormControl(''),
      firstName: new FormControl(''),
      middleName: new FormControl(''),
      phoneNumber: new FormControl(''),
      institution: new FormControl(''),
      email: new FormControl(''),
    });
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

class MockValidationHintForInputComponent {
  @Input() validationFormControl: FormControl; 
  @Input() minCharachters: number;
  @Input() maxCharachters: number;
  @Input() minMaxDate: boolean;
  @Input() isTouched: boolean;
  @Input() isPhoneNumber: boolean;
}
