import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkshopInfoComponent } from './workshop-info.component';

describe('WorkshopInfoComponent', () => {
  let component: WorkshopInfoComponent;
  let fixture: ComponentFixture<WorkshopInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WorkshopInfoComponent]
    });
    fixture = TestBed.createComponent(WorkshopInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
