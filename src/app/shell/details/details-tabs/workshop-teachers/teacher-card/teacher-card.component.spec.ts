import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeacherCardComponent } from './teacher-card.component';
import { MatCardModule } from '@angular/material/card';
import { Teacher } from 'shared/models/teacher.model';
import { MatTooltipModule } from '@angular/material/tooltip';

describe('TeacherCardComponent', () => {
  let component: TeacherCardComponent;
  let fixture: ComponentFixture<TeacherCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatCardModule, MatTooltipModule],
      declarations: [TeacherCardComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherCardComponent);
    component = fixture.componentInstance;
    component.teacher = {} as Teacher;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
