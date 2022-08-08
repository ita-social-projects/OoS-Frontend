import { CdkStepper, CdkStepperModule } from '@angular/cdk/stepper';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';
import { Department, Direction } from 'src/app/shared/models/category.model';

import { AddDepartmentFormComponent } from './add-department-form.component';

describe('AddClassFormComponent', () => {
  let component: AddDepartmentFormComponent;
  let fixture: ComponentFixture<AddDepartmentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        RouterTestingModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatDialogModule,
        BrowserAnimationsModule,
        NgxsModule.forRoot([]),
        MatStepperModule,
        NoopAnimationsModule,
        CdkStepperModule,
       ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [
        AddDepartmentFormComponent,
      ],
      providers: [
        { provide: CdkStepper, }
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDepartmentFormComponent);
    component = fixture.componentInstance;
    component.departmentFormGroup = new FormGroup({
      title: new FormControl(''),
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
