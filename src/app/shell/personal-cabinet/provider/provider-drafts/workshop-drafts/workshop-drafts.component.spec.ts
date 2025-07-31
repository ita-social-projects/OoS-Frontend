import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkshopDraftsComponent } from './workshop-drafts.component';

describe('WorkshopDraftsComponent', () => {
  let component: WorkshopDraftsComponent;
  let fixture: ComponentFixture<WorkshopDraftsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkshopDraftsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(WorkshopDraftsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
