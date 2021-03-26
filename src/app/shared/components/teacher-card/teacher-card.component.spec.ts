import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherCardComponent } from './teacher-card.component';

describe('TeacherCardComponent', () => {
  let component: TeacherCardComponent;
  let fixture: ComponentFixture<TeacherCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeacherCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
