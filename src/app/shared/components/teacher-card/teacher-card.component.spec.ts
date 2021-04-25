import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherCardComponent } from './teacher-card.component';

describe('TeacherCardComponent', () => {
  let component: TeacherCardComponent;
  let fixture: ComponentFixture<TeacherCardComponent>;
  const mockTeacherCard = {
    img: 'test',
    name: 'test',
    description: 'test'
  }
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeacherCardComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherCardComponent);
    component = fixture.componentInstance;
    component.cards = mockTeacherCard;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
