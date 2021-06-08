import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkshopPageComponent } from './workshop-page.component';
import { Component, Input } from '@angular/core';
import { Workshop } from '../../../shared/models/workshop.model';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';

describe('WorkshopPageComponent', () => {
  let component: WorkshopPageComponent;
  let fixture: ComponentFixture<WorkshopPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatChipsModule,
        MatTabsModule
      ],
      declarations: [ WorkshopPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkshopPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
@Component({
  selector: 'app-workshop-about',
  template: ''
})
class MockWorkshopAboutComponent {
  @Input() workshop: Workshop;
}
