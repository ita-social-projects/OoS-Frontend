import { CdkStepperModule } from '@angular/cdk/stepper';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';
import { Department, Direction, IClass } from 'src/app/shared/models/category.model';

import { ClassesCheckBoxListComponent } from './classes-check-box-list.component';

describe('ClassesCheckBoxListComponent', () => {
  let component: ClassesCheckBoxListComponent;
  let fixture: ComponentFixture<ClassesCheckBoxListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        RouterTestingModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        NgxsModule.forRoot([]),
        MatStepperModule,
        NoopAnimationsModule,
        CdkStepperModule,
        MatDialogModule,
       ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [
        ClassesCheckBoxListComponent,
        MockValidationHintForInputComponent,
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassesCheckBoxListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  @Component({
    selector: 'app-validation-hint-for-input',
    template: ''
  })

  class MockValidationHintForInputComponent {
    @Input() type: string;
    @Input() invalid: boolean;
    @Input() minLength: boolean;
    @Input() minCharachters: number;
    @Input() forbiddenCharacter: string;
    @Input() isEmptyCheck: boolean;
    @Input() direction: Direction;
    @Input() department: Department;
    @Input() directionFormGroup: FormGroup;
    @Input() classFormGroup: FormGroup;
    @Input() departmentFormGroup: FormGroup;
    @Input() router: Router;
  }
});
