import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkingHoursComponent } from './working-hours.component';
import { NgxsModule } from '@ngxs/store';
import { FormsModule } from '@angular/forms';

describe('WorkingHoursComponent', () => {
  let component: WorkingHoursComponent;
  let fixture: ComponentFixture<WorkingHoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([]),
        FormsModule
      ],
      declarations: [WorkingHoursComponent],
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
