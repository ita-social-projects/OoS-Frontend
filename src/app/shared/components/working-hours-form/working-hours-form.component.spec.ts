import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkingHoursFormComponent } from './working-hours-form.component';

describe('WorkingHoursFormComponent', () => {
  let component: WorkingHoursFormComponent;
  let fixture: ComponentFixture<WorkingHoursFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkingHoursFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkingHoursFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
