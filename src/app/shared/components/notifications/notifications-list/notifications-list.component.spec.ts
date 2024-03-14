import { CdkAccordionModule } from '@angular/cdk/accordion';
import { Injectable } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule, State, Store } from '@ngxs/store';

import { NotificationDeclination } from 'shared/enum/enumUA/declinations/notification-declination';
import { NotificationAction, NotificationType } from 'shared/enum/notifications';
import { PersonalCabinetLinks } from 'shared/enum/personal-cabinet-links';
import { Notification, NotificationGrouped } from 'shared/models/notification.model';
import { MaterialModule } from 'shared/modules/material.module';
import { TranslateCasesPipe } from 'shared/pipes/translate-cases.pipe';
import { ChatStateModel } from 'shared/store/chat.state';
import { ReadAllUsersNotifications, ReadUsersNotificationById, ReadUsersNotificationsByType } from 'shared/store/notification.actions';
import { NotificationStateModel } from 'shared/store/notification.state';
import { NotificationsListComponent } from './notifications-list.component';

describe('NotificationsListComponent', () => {
  let component: NotificationsListComponent;
  let fixture: ComponentFixture<NotificationsListComponent>;
  let store: Store;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([MockNotificationState, MockChatState]),
        MaterialModule,
        RouterModule,
        TranslateModule.forRoot(),
        CdkAccordionModule,
        RouterTestingModule
      ],
      declarations: [NotificationsListComponent, TranslateCasesPipe]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationsListComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('declination', () => {
    let notification: NotificationGrouped;

    beforeEach(() => {
      notification = { type: NotificationType.Application, amount: 2 };
    });

    it('should return correct notification declination for Application notification with Approved data', () => {
      notification.groupedData = 'Approved';

      const declination = component.defineDeclination(notification);

      expect(declination).toEqual(NotificationDeclination.Application.Approved);
    });

    it('should return null notification declination for Application notification with Unknown data', () => {
      notification.groupedData = 'Unknown';

      const declination = component.defineDeclination(notification);

      expect(declination).toEqual(null);
    });
  });

  describe('onNavigate', () => {
    const notification: Notification = {
      type: undefined,
      action: undefined,
      userId: undefined,
      createdDateTime: undefined,
      data: {}
    };

    it('should not navigate when notification action is Delete', () => {
      jest.spyOn(router, 'navigate');

      notification.action = NotificationAction.Delete;

      component.onNavigate(notification);

      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should navigate to workshop details when notification type is Workshop', () => {
      jest.spyOn(router, 'navigate');

      notification.type = NotificationType.Workshop;
      notification.objectId = 'workshopId';

      component.onNavigate(notification);

      expect(router.navigate).toHaveBeenCalledWith(['details/workshop', notification.objectId]);
    });

    it('should navigate to chat in personal cabinet when notification type is Chat', () => {
      jest.spyOn(router, 'navigate');

      notification.type = NotificationType.Chat;

      component.onNavigate(notification);

      expect(router.navigate).toHaveBeenCalledWith(['personal-cabinet', PersonalCabinetLinks.Chat]);
    });

    it('should navigate to provider info in personal cabinet when notification type is Provider and action is Block', () => {
      jest.spyOn(router, 'navigate');

      notification.type = NotificationType.Provider;
      notification.action = NotificationAction.Block;

      component.onNavigate(notification);

      expect(router.navigate).toHaveBeenCalledWith(['personal-cabinet/provider/info']);
    });

    it('should navigate to provider list in admin tools when notification type is Provider and action is not Block or Unblock', () => {
      jest.spyOn(router, 'navigate');

      notification.type = NotificationType.Provider;
      notification.action = NotificationAction.Create;

      component.onNavigate(notification);

      expect(router.navigate).toHaveBeenCalledWith(['admin-tools/data/provider-list']);
    });

    it('should navigate to provider details when notification type is Parent and action is ProviderBlock', () => {
      jest.spyOn(router, 'navigate');

      notification.type = NotificationType.Parent;
      notification.action = NotificationAction.ProviderBlock;
      notification.data.ProviderId = 'providerId';

      component.onNavigate(notification);

      expect(router.navigate).toHaveBeenCalledWith(['details/provider', notification.data.ProviderId]);
    });
  });

  describe('onRead', () => {
    beforeEach(() => {
      component.notificationsGroupedByType = [
        {
          type: NotificationType.Application,
          amount: 4
        },
        {
          type: NotificationType.Workshop,
          amount: 1
        }
      ];
      component.notifications = [
        {
          type: NotificationType.Parent,
          action: NotificationAction.ProviderBlock,
          userId: undefined,
          data: {},
          createdDateTime: undefined
        },
        {
          type: NotificationType.Provider,
          action: NotificationAction.Update,
          userId: undefined,
          data: { Status: 'Recheck' },
          createdDateTime: undefined
        },
        {
          type: NotificationType.Provider,
          action: NotificationAction.Create,
          userId: undefined,
          data: {},
          createdDateTime: undefined
        }
      ];
      component.notificationAmount = { amount: 7 };
    });

    it('onReadAll should dispatch ReadAllUsersNotifications action, modify all notifications and clear amount', () => {
      jest.spyOn(store, 'dispatch');

      component.onReadAll();

      component.notificationsGroupedByType.forEach((notification) => expect(notification.isRead).toBeTruthy());
      component.notifications.forEach((notification) => expect(notification.readDateTime).toBeTruthy());
      expect(store.dispatch).toHaveBeenCalledWith(new ReadAllUsersNotifications());
      expect(component.notificationAmount.amount).toEqual(0);
    });

    it('onReadGroup should dispatch ReadUsersNotificationsByType action, modify all grouped notifications and reduce amount', () => {
      jest.spyOn(store, 'dispatch');

      const notificationsGroupedByType = component.notificationsGroupedByType[0];
      component.onReadGroup(notificationsGroupedByType);

      expect(store.dispatch).toHaveBeenCalledWith(new ReadUsersNotificationsByType(notificationsGroupedByType.type));
      expect(notificationsGroupedByType.isRead).toBeTruthy();
      expect(component.notificationAmount.amount).toEqual(3);
    });

    it('onReadGroup should skip if isRead', () => {
      jest.spyOn(store, 'dispatch');

      const notificationsGroupedByType = component.notificationsGroupedByType[0];
      notificationsGroupedByType.isRead = true;
      component.onReadGroup(notificationsGroupedByType);

      expect(store.dispatch).not.toHaveBeenCalledWith(new ReadUsersNotificationsByType(notificationsGroupedByType.type));
    });

    it('onReadSingle should dispatch ReadUsersNotificationById action, modify notification and reduce amount', () => {
      jest.spyOn(store, 'dispatch');

      const notification = component.notifications[0];
      component.onReadSingle(notification);

      expect(store.dispatch).toHaveBeenCalledWith(new ReadUsersNotificationById(notification));
      expect(notification.readDateTime).toBeTruthy();
      expect(component.notificationAmount.amount).toEqual(6);
    });

    it('onReadGroup should skip if readDateTime already set', () => {
      jest.spyOn(store, 'dispatch');

      const notification = component.notifications[0];
      notification.readDateTime = new Date();
      component.onReadSingle(notification);

      expect(store.dispatch).not.toHaveBeenCalledWith(new ReadUsersNotificationById(notification));
    });
  });

  describe('addReceivedNotification', () => {
    beforeEach(() => {
      component.notificationsGroupedByType = [
        {
          type: NotificationType.Application,
          amount: 3,
          groupedByAdditionalData: [
            {
              type: NotificationType.Application,
              action: NotificationAction.Create,
              groupedData: 'Pending',
              amount: 3
            }
          ]
        }
      ];
      component.notifications = [
        {
          type: NotificationType.Parent,
          action: NotificationAction.ProviderBlock,
          userId: undefined,
          data: {},
          createdDateTime: undefined
        }
      ];
      component.notificationAmount = { amount: 4 };
    });

    describe('notification group', () => {
      let notification: Notification;
      let initialNotificationsGroupedByTypeLength: number;
      let initialNotificationAmount: number;

      beforeEach(() => {
        notification = {
          type: NotificationType.Application,
          action: NotificationAction.Create,
          userId: undefined,
          createdDateTime: undefined,
          data: { Status: 'Pending' }
        };
        initialNotificationsGroupedByTypeLength = component.notificationsGroupedByType.length;
        initialNotificationAmount = component.notificationAmount.amount;
      });

      it('should add amount to notifications grouped when received with existing additional data', () => {
        const initialNotificationsGroupedByDataAmount = component.notificationsGroupedByType[0].groupedByAdditionalData[0].amount;

        component.ngOnChanges({
          receivedNotification: {
            currentValue: notification,
            firstChange: false,
            previousValue: undefined,
            isFirstChange: undefined
          }
        });

        expect(component.notificationsGroupedByType.length).toEqual(initialNotificationsGroupedByTypeLength);
        expect(component.notificationsGroupedByType[0].groupedByAdditionalData[0].amount).toEqual(
          initialNotificationsGroupedByDataAmount + 1
        );
        expect(component.notificationAmount.amount).toEqual(initialNotificationAmount + 1);
      });

      it('should add a new notification group to notifications grouped when received with another type', () => {
        notification.type = NotificationType.Chat;

        component.ngOnChanges({
          receivedNotification: {
            currentValue: notification,
            firstChange: false,
            previousValue: undefined,
            isFirstChange: undefined
          }
        });

        expect(component.notificationsGroupedByType.length).toEqual(initialNotificationsGroupedByTypeLength + 1);
        expect(component.notificationAmount.amount).toEqual(initialNotificationAmount + 1);
      });

      it('should add a new notification group to notifications grouped when received with another additional data', () => {
        const initialNotificationsGroupedByDataLength = component.notificationsGroupedByType[0].groupedByAdditionalData.length;
        notification.data.Status = 'Rejected';

        component.ngOnChanges({
          receivedNotification: {
            currentValue: notification,
            firstChange: false,
            previousValue: undefined,
            isFirstChange: undefined
          }
        });

        expect(component.notificationsGroupedByType.length).toEqual(initialNotificationsGroupedByTypeLength);
        expect(component.notificationsGroupedByType[0].groupedByAdditionalData.length).toEqual(initialNotificationsGroupedByDataLength + 1);
        expect(component.notificationAmount.amount).toEqual(initialNotificationAmount + 1);
      });
    });

    it('should add a new notification to notifications when received', () => {
      const notification: Notification = {
        type: NotificationType.Provider,
        action: NotificationAction.Create,
        userId: undefined,
        createdDateTime: undefined,
        data: {}
      };
      const initialNotificationsLength = component.notifications.length;
      const initialNotificationAmount = component.notificationAmount.amount;

      component.ngOnChanges({
        receivedNotification: {
          currentValue: notification,
          firstChange: false,
          previousValue: undefined,
          isFirstChange: undefined
        }
      });

      expect(component.notifications.length).toEqual(initialNotificationsLength + 1);
      expect(component.notificationAmount.amount).toEqual(initialNotificationAmount + 1);
    });
  });
});

@State<NotificationStateModel>({
  name: 'notifications',
  defaults: {
    notificationAmount: { amount: 3 },
    notifications: {
      notificationsGroupedByType: [{ type: NotificationType.System }],
      notifications: []
    }
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
