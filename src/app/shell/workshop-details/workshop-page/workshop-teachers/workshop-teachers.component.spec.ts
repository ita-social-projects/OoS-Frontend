import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkshopTeachersComponent } from './workshop-teachers.component';

describe('WorkshopTeachersComponent', () => {
  let component: WorkshopTeachersComponent;
  let fixture: ComponentFixture<WorkshopTeachersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkshopTeachersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkshopTeachersComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

