import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store, NgxsModule } from '@ngxs/store';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';

import { MaterialModule } from 'shared/modules/material.module';
import { ValidationHintComponent } from 'shared/components/validation-hint/validation-hint.component';
import { SetEndTime, SetStartTime } from 'shared/store/filter.actions';
import { WorkingHoursComponent } from './working-hours.component';

describe('WorkingHoursComponent', () => {
  let component: WorkingHoursComponent;
  let fixture: ComponentFixture<WorkingHoursComponent>;
  let storeMock: { dispatch: jest.Mock };

  beforeEach(async () => {
    storeMock = { dispatch: jest.fn() };
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
        TranslateModule.forRoot()
      ],
      declarations: [WorkingHoursComponent, ValidationHintComponent],
      providers: [{ provide: Store, useValue: storeMock }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkingHoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset the form control value', () => {
    const formControl = new FormControl('12:00');

    component.onClearTime(formControl);

    expect(formControl.value).toBeNull();
  });

  it('should set the given value to the form control', () => {
    const formControl = new FormControl();

    component.onTimeSet('15:30', formControl);

    expect(formControl.value).toBe('15:30');
  });

  it('should apply filters with startTime', () => {
    component.startTimeFormControl.setValue('12:30');

    (component as any).applyFilters();

    expect(storeMock.dispatch).toHaveBeenCalledWith(new SetStartTime('12:30'));
    expect(storeMock.dispatch).toHaveBeenCalledWith(new SetEndTime(''));
  });

  it('should apply filters without data', () => {
    component.startTimeFormControl.setValue(undefined);
    component.endTimeFormControl.setValue(undefined);

    (component as any).applyFilters();

    expect(storeMock.dispatch).toHaveBeenCalledWith(new SetStartTime(''));
    expect(storeMock.dispatch).toHaveBeenCalledWith(new SetEndTime(''));
  });
});
