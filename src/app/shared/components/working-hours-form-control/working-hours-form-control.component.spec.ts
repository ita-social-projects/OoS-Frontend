import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkingHoursFormControlComponent } from './working-hours-form-control.component';

describe('WorkingHoursFormControlComponent', () => {
  let component: WorkingHoursFormControlComponent;
  let fixture: ComponentFixture<WorkingHoursFormControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkingHoursFormControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkingHoursFormControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
