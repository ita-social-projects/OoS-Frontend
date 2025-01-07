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
import { MatCheckboxModule } from '@angular/material/checkbox';
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
        MatCheckboxModule,
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
      description: new FormControl(''),
      coverImage: new FormControl(''),
      coverImageId: new FormControl(''),
      defaultTeacher: new FormControl(false)
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit delete when onDeleteTeacher is called', () => {
    const mockIndex = 1;
    jest.spyOn(component.deleteForm, 'emit');

    component.index = mockIndex;
    component.onDeleteTeacher();

    expect(component.deleteForm.emit).toHaveBeenCalledWith(mockIndex);
  });

  it('should set value is equal to NULL in form control on focus out event if current form control is pristine', () => {
    const mockedFormControlName = 'lastName';
    const setValueSpy = jest.spyOn(component.TeacherFormGroup.controls.lastName, 'setValue');
    const getFormControlSpy = jest.spyOn(component.TeacherFormGroup, 'get');

    component.onFocusOut(mockedFormControlName);

    expect(getFormControlSpy).toHaveBeenCalledWith(mockedFormControlName);
    expect(setValueSpy).toHaveBeenCalledWith(null);
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
