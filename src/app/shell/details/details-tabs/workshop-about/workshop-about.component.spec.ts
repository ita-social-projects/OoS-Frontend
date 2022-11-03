import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkshopAboutComponent } from './workshop-about.component';
import { Workshop } from '../../../../shared/models/workshop.model';

describe('WorkshopAboutComponent', () => {
  let component: WorkshopAboutComponent;
  let fixture: ComponentFixture<WorkshopAboutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkshopAboutComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkshopAboutComponent);
    component = fixture.componentInstance;
    component.workshop = {} as Workshop;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
