import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildActivitiesComponent } from './child-activities.component';

describe('ChildActivitiesComponent', () => {
  let component: ChildActivitiesComponent;
  let fixture: ComponentFixture<ChildActivitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChildActivitiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
