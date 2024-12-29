import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../../../../../../../shared/modules/material.module';
import { WorkingHoursFormComponent } from './working-hours-form.component';

describe('WorkingHoursFormComponent', () => {
  let component: WorkingHoursFormComponent;
  let fixture: ComponentFixture<WorkingHoursFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        BrowserAnimationsModule,
        MatDatepickerModule,
        MatInputModule,
        NgxMatTimepickerModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatIconModule,
        TranslateModule.forRoot(),
        MaterialModule
      ],
      declarations: [WorkingHoursFormComponent, MockValidationHintForInputComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkingHoursFormComponent);
    component = fixture.componentInstance;
    component.workingHoursForm = new FormGroup({
      workdays: new FormControl([]),
      endTime: new FormControl(''),
      startTime: new FormControl('')
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be valid startTime and endTime', () => {
    const startTime = component.workingHoursForm.get('startTime');
    const endTime = component.workingHoursForm.get('endTime');

    startTime?.setValue('08:00');
    endTime?.setValue('18:00');
    expect(component.workingHoursForm.valid).toBeTruthy();

    endTime?.setValue('07:00');
    expect(component.workingHoursForm.errors).toEqual({ invalidTimeRange: true });
  });

  it('should clean input value by removing non-numeric and non-colon characters', () => {
    const value = '12a:b3#4$';

    const validValue = component.validateTimeInput(value);

    expect(validValue).toBe('12:34');
  });

  it('should set time via timePicker', () => {
    component.startTimeFormControl.setValue('');
    component.endTimeFormControl.setValue('');

    component.onTimeSet('12:30', component.startTimeFormControl);
    component.onTimeSet('14:30', component.endTimeFormControl);

    expect(component.startTimeFormControl.value).toBe('12:30');
    expect(component.endTimeFormControl.value).toBe('14:30');
  });
});
@Component({
  selector: 'app-validation-hint',
  template: ''
})
class MockValidationHintForInputComponent {
  @Input() validationFormControl: FormControl; // required for validation
  @Input() minCharacters: number;
  @Input() maxCharacters: number;
  @Input() minMaxDate: boolean;
}
