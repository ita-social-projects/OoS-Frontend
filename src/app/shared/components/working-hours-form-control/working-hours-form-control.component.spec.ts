import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkingHoursFormControlComponent } from './working-hours-form-control.component';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { DateTimeRanges } from '../../models/workingHours.model';

describe('WorkingHoursFormControlComponent', () => {
  let component: WorkingHoursFormControlComponent;
  let fixture: ComponentFixture<WorkingHoursFormControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        MatIconModule,
        MatInputModule
      ],
      declarations: [WorkingHoursFormControlComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkingHoursFormControlComponent);
    component = fixture.componentInstance;
    component.workHour = {
      workdays: [],
      startTime: '',
      endTime: '',
    } as DateTimeRanges;
    component.days = [];
    component.index = 0;
    component.workingHoursAmount = 0;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
