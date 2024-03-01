import { CUSTOM_ELEMENTS_SCHEMA, Component, Injectable, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { NgxsModule, State } from '@ngxs/store';

import { OidcSecurityService } from 'angular-auth-oidc-client';
import { ChatStateModel } from 'shared/store/chat.state';
import { NotificationStateModel } from 'shared/store/notification.state';
import { MockOidcSecurityService } from '../../mocks/mock-services';
import { NotificationsComponent } from './notifications.component';

describe('NotificationsComponent', () => {
  let component: NotificationsComponent;
  let fixture: ComponentFixture<NotificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([MockNotificationState, MockChatState]), MatMenuModule, MatIconModule],
      declarations: [NotificationsComponent, MockNotificationsListComponent],
      providers: [{ provide: OidcSecurityService, useValue: MockOidcSecurityService }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

@State<NotificationStateModel>({
  name: 'notifications',
  defaults: {
    notificationAmount: { amount: 3 },
    notifications: undefined
  }
})
@Injectable()
class MockNotificationState {}

@State<ChatStateModel>({
  name: 'chat',
  defaults: {
    isLoadingData: false,
    chatRooms: null,
    selectedChatRoom: null,
    selectedChatRoomMessages: null,
    unreadMessagesCount: 2
  }
})
@Injectable()
class MockChatState {}

@Component({
  selector: 'app-notifications-list',
  template: ''
})
class MockNotificationsListComponent {}
