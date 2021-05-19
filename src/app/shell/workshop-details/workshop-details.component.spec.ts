import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkshopDetailsComponent } from './workshop-details.component';

describe('WorkshopDetailsComponent', () => {
  let component: WorkshopDetailsComponent;
  let fixture: ComponentFixture<WorkshopDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkshopDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkshopDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
