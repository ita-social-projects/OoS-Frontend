import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { Store } from '@ngxs/store';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';
import { of } from 'rxjs';
import { Workshop } from '../../../shared/models/workshop.model';
import { User } from '../../../shared/models/user.model';
import { Address } from '../../../shared/models/address.model';
import { SideMenuComponent } from './side-menu.component';

describe('SideMenuComponent', () => {
  let component: SideMenuComponent;
  let fixture: ComponentFixture<SideMenuComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, NgxsModule.forRoot([])],
      declarations: [SideMenuComponent, MockActionsComponent, MockContactsComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SideMenuComponent);
    component = fixture.componentInstance;
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
  @Input() address: Address;
  @Input() contactsData: any;
}

@Component({
  selector: 'app-actions',
  template: ''
})
class MockActionsComponent {
  @Input() workshop: Workshop;
  @Input() role: string;
}
