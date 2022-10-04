import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkingHoursComponent } from './working-hours.component';
import { NgxsModule } from '@ngxs/store';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MaterialModule } from '../../../modules/material.module';

describe('WorkingHoursComponent', () => {
  let component: WorkingHoursComponent;
  let fixture: ComponentFixture<WorkingHoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatIconModule,
        BrowserModule,
        BrowserAnimationsModule,
        MatDatepickerModule,
        MatInputModule,
        NgxMatTimepickerModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MaterialModule,
        NgxsModule.forRoot([]),
      ],
      declarations: [
        WorkingHoursComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkingHoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
