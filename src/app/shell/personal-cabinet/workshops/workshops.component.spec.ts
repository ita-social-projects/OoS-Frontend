import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkshopsComponent } from './workshops.component';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { Component, Input } from '@angular/core';
import { Workshop } from '../../../shared/models/workshop.model';

describe('WorkshopsComponent', () => {
  let component: WorkshopsComponent;
  let fixture: ComponentFixture<WorkshopsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        NgxsModule.forRoot([]),
      ],
      declarations: [
        WorkshopsComponent,
        MockWorkshopCardComponent
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkshopsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
@Component({
  selector: 'app-workshop-card',
  template: ''
})
class MockWorkshopCardComponent {
  @Input() workshop: Workshop;
  @Input() type: string;
}
