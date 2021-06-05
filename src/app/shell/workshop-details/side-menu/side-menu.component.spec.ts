import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideMenuComponent } from './side-menu.component';
import { Component, Input } from '@angular/core';
import { Workshop } from '../../../shared/models/workshop.model';

describe('SideMenuComponent', () => {
  let component: SideMenuComponent;
  let fixture: ComponentFixture<SideMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        SideMenuComponent,
        MockScheduleComponent,
        MockActionsComponent,
        MockContactsComponent
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SideMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

@Component({
  selector: 'app-contacts',
  template: ''
})
class MockContactsComponent {
  @Input() workshop: Workshop;
}

@Component({
  selector: 'app-actions',
  template: ''
})
class MockActionsComponent {
  @Input() workshop: Workshop;
}

@Component({
  selector: 'app-schedule',
  template: ''
})
class MockScheduleComponent {
  @Input() workshop: Workshop;
}
