import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkingHoursFormControlComponent } from './working-hours-form-control.component';
import { SelectedWorkingHours } from '../../models/workingHours.model';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

describe('WorkingHoursFormControlComponent', () => {
  let component: WorkingHoursFormControlComponent;
  let fixture: ComponentFixture<WorkingHoursFormControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[
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
      day: [],
      timeFrom: '',
      timeTo: '',
    } as SelectedWorkingHours;
    component.days = [];
    component.index = 0;
    component.workingHoursAmount = 0;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
