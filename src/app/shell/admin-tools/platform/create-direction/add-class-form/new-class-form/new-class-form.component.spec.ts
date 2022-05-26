import { CdkStepperModule } from '@angular/cdk/stepper';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';
import { Department, Direction } from 'src/app/shared/models/category.model';

import { NewClassFormComponent } from './new-class-form.component';

describe('NewClassFormComponent', () => {
  let component: NewClassFormComponent;
  let fixture: ComponentFixture<NewClassFormComponent>;

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
        NewClassFormComponent,
        MockValidationHintForInputComponent,
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewClassFormComponent);
    component = fixture.componentInstance;
    component.classFormGroup = new FormGroup({
      title: new FormControl(''),
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(Component).toBeTruthy();
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
    @Input() formIndex: number;
    @Input() classAmount;
  }
});
