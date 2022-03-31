import { CdkStepperModule } from '@angular/cdk/stepper';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';

import { AddClassFormComponent } from './add-class-form.component';

describe('AddClassFormComponent', () => {
  let component: AddClassFormComponent;
  let fixture: ComponentFixture<AddClassFormComponent>;

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
        AddClassFormComponent,
        MockValidationHintForInputComponent,
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddClassFormComponent);
    component = fixture.componentInstance;
    component.ClassFormGroup = new FormGroup({
      title: new FormControl(''),
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
  @Input() minLength: boolean;
  @Input() minCharachters: number;
  @Input() forbiddenCharacter: string;
  @Input() isEmptyCheck: boolean;
}
