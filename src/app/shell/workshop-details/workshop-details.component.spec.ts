import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkshopDetailsComponent } from './workshop-details.component';
import { NgxsModule, Store } from '@ngxs/store';
import { MockStore } from '../../shared/mocks/mock-services';
import { Component, Input } from '@angular/core';
import { Workshop } from '../../shared/models/workshop.model';

describe('WorkshopDetailsComponent', () => {
  let component: WorkshopDetailsComponent;
  let fixture: ComponentFixture<WorkshopDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([]),
      ],
      declarations: [
        WorkshopDetailsComponent,
        MockSideMenuComponent,
        MockWorkshopPageComponent
      ]
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

@Component({
  selector: 'app-workshop-page',
  template: ''
})
class MockWorkshopPageComponent {
  @Input() workshop: Workshop;
}

@Component({
  selector: 'app-side-menu',
  template: ''
})
class MockSideMenuComponent {
  @Input() workshop: Workshop;
}

