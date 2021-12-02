import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SideMenuComponent } from './side-menu.component';
import { Component, Input } from '@angular/core';
import { Workshop } from '../../../shared/models/workshop.model';
import { Store } from '@ngxs/store';
import { User } from 'src/app/shared/models/user.model';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule } from '@ngxs/store';
import { FlexLayoutModule } from '@angular/flex-layout';

describe('SideMenuComponent', () => {
  let component: SideMenuComponent;
  let fixture: ComponentFixture<SideMenuComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        NgxsModule.forRoot([]),
        FlexLayoutModule
      ],
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
    store = TestBed.inject(Store);
    spyOn(store, 'selectSnapshot').and.returnValue({ role: '' } as User);
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
  @Input() role: string;
}

@Component({
  selector: 'app-actions',
  template: ''
})
class MockActionsComponent {
  @Input() workshop: Workshop;
  @Input() role: string;
}

@Component({
  selector: 'app-schedule',
  template: ''
})
class MockScheduleComponent {
  @Input() workshop: Workshop;
}
