import { MatIconModule } from '@angular/material/icon';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeacherFormComponent } from './teacher-form.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ImageFormControlComponent } from '../../../../../../shared/components/image-form-control/image-form-control.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { Component, Input } from '@angular/core';

describe('TeacherFormComponent', () => {
  let component: TeacherFormComponent;
  let fixture: ComponentFixture<TeacherFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatFormFieldModule,
        MatDatepickerModule,
        MatNativeDateModule,
        ReactiveFormsModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule,
        MatIconModule,
        MatGridListModule
      ],
      declarations: [
        ImageFormControlComponent,
        TeacherFormComponent,
        MockValidationHintForInputComponent
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherFormComponent);
    component = fixture.componentInstance;
    component.TeacherFormGroup = new FormGroup({
      img: new FormControl(''),
      lastName: new FormControl(''),
      firstName: new FormControl(''),
      middleName: new FormControl(''),
      dateOfBirth: new FormControl(''),
      description: new FormControl(''),
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
}