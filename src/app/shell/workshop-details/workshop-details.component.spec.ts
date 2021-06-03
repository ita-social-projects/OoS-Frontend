import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkshopDetailsComponent } from './workshop-details.component';

describe('ChildActivitiesComponent', () => {
  let component: WorkshopDetailsComponent;
  let fixture: ComponentFixture<WorkshopDetailsComponent>;
  
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
      declarations: [ WorkshopDetailsComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkshopDetailsComponent);
    component = fixture.componentInstance;
    //component.child = mockChildData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
