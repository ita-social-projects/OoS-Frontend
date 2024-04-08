import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatRadioModule } from '@angular/material/radio';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';

import { ImageFormControlComponent } from 'shared/components/image-form-control/image-form-control.component';
import { TeacherFormComponent } from './teacher-form.component';

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
        MatGridListModule,
        MatRadioModule,
        TranslateModule.forRoot()
      ],
      declarations: [ImageFormControlComponent, TeacherFormComponent, MockValidationHintForInputComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherFormComponent);
    component = fixture.componentInstance;
    component.TeacherFormGroup = new FormGroup({
      img: new FormControl(''),
      lastName: new FormControl(''),
      firstName: new FormControl(''),
      middleName: new FormControl(''),
      gender: new FormControl(''),
      dateOfBirth: new FormControl(''),
      description: new FormControl('')
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
  @Input() minCharacters: number;
  @Input() maxCharacters: number;
  @Input() minMaxDate: boolean;
  @Input() isTouched: boolean;
}
