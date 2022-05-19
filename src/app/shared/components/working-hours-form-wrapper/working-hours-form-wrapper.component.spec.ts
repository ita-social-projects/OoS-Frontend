import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';

import { WorkingHoursFormWrapperComponent } from './working-hours-form-wrapper.component';

describe('WorkingHoursFormWrapperComponent', () => {
  let component: WorkingHoursFormWrapperComponent;
  let fixture: ComponentFixture<WorkingHoursFormWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkingHoursFormWrapperComponent, MockWorkingHours ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkingHoursFormWrapperComponent);
    component = fixture.componentInstance;
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
