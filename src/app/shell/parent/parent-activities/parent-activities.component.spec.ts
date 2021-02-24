import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentActivitiesComponent } from './parent-activities.component';

describe('ParentActivitiesComponent', () => {
  let component: ParentActivitiesComponent;
  let fixture: ComponentFixture<ParentActivitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParentActivitiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParentActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
