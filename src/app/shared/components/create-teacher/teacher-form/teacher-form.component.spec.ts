import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherFormComponent } from './teacher-form.component';

describe('TeacherFormComponent', () => {
  let component: TeacherFormComponent;
  let fixture: ComponentFixture<TeacherFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
<<<<<<< HEAD:src/app/shared/components/hobby-select/hobby-select.component.spec.ts
      declarations: [ HobbySelectComponent ],
      schemas: [NO_ERRORS_SCHEMA]
=======
      declarations: [ TeacherFormComponent ]
>>>>>>> origin/develop:src/app/shared/components/create-teacher/teacher-form/teacher-form.component.spec.ts
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
