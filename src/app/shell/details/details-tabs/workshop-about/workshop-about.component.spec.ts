import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkshopAboutComponent } from './workshop-about.component';
import { Workshop } from 'shared/models/workshop.model';
import {TranslateModule} from '@ngx-translate/core';

describe('WorkshopAboutComponent', () => {
  let component: WorkshopAboutComponent;
  let fixture: ComponentFixture<WorkshopAboutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
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
