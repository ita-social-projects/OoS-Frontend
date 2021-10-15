import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
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
        MatIconModule,],
      declarations: [
        WorkingHoursFormComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkingHoursFormComponent);
    component = fixture.componentInstance;
    component.workingHoursForm = new FormGroup({
      workdays: new FormControl([]),
      endTime: new FormControl(''),
      startTime: new FormControl(''),
    })
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
