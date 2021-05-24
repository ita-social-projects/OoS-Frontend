import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkshopAboutComponent } from './workshop-about.component';

describe('WorkshopAboutComponent', () => {
  let component: WorkshopAboutComponent;
  let fixture: ComponentFixture<WorkshopAboutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkshopAboutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkshopAboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
