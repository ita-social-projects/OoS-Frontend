import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildActivitiesComponent } from './child-activities.component';

describe('ChildActivitiesComponent', () => {
  let component: ChildActivitiesComponent;
  let fixture: ComponentFixture<ChildActivitiesComponent>;
  
  const mockChildData = {
    name: 'test',
    activitiesList: [
      {
        activityName: 'test',
        providerName: 'test',
        address: 'test',
        status: 'test'
      }
    ]
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChildActivitiesComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildActivitiesComponent);
    component = fixture.componentInstance;
    component.child = mockChildData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
