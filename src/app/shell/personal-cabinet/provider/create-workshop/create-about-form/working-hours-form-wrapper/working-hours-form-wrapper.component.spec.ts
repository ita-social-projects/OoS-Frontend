import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { WorkingHoursFormWrapperComponent } from './working-hours-form-wrapper.component';

describe('WorkingHoursFormWrapperComponent', () => {
  let component: WorkingHoursFormWrapperComponent;
  let fixture: ComponentFixture<WorkingHoursFormWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[
        MatIconModule,
        ReactiveFormsModule,
        FormsModule,
        MatButtonModule,
        BrowserModule,
        BrowserAnimationsModule,
      ],
      declarations: [ 
        WorkingHoursFormWrapperComponent, 
        MockWorkingHours 
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkingHoursFormWrapperComponent);
    component = fixture.componentInstance;
    component.workingHoursFormArray = new FormArray([]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

@Component({
  selector: 'app-working-hours-form',
  template: ''
})
class MockWorkingHours {
  @Input() workingHoursForm: FormGroup;
  @Input() index: number;
  @Input() workingHoursAmount: number;
}
