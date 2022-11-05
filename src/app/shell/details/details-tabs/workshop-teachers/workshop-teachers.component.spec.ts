import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkshopTeachersComponent } from './workshop-teachers.component';
import { Component, Input } from '@angular/core';
import { Teacher } from '../../../../shared/models/teacher.model';
import { NoResultCardComponent } from '../../../../shared/components/no-result-card/no-result-card.component';

describe('WorkshopTeachersComponent', () => {
  let component: WorkshopTeachersComponent;
  let fixture: ComponentFixture<WorkshopTeachersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkshopTeachersComponent, MockTeacherCardComponent, NoResultCardComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkshopTeachersComponent);
    component = fixture.componentInstance;
    component.teachers = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

@Component({
  selector: 'app-teacher-card',
  template: ''
})
class MockTeacherCardComponent {
  @Input() teacher: Teacher;
}
