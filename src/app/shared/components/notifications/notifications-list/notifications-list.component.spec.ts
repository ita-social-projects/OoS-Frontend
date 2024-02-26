import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxsModule, Store } from '@ngxs/store';

import { Router } from '@angular/router';
import { NotificationDeclination } from 'shared/enum/enumUA/declinations/notification-declination';
import { NotificationAction, NotificationType } from 'shared/enum/notifications';
import { PersonalCabinetLinks } from 'shared/enum/personal-cabinet-links';
import { Notification } from 'shared/models/notification.model';
import { TranslateCasesPipe } from 'shared/pipes/translate-cases.pipe';
import { ReadAllUsersNotifications, ReadUsersNotificationById, ReadUsersNotificationsByType } from 'shared/store/notification.actions';
import { NotificationsListComponent } from './notifications-list.component';

describe('NotificationsListComponent', () => {
  let component: NotificationsListComponent;
  let fixture: ComponentFixture<NotificationsListComponent>;
  let store: Store;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([]), MatIconModule, RouterTestingModule],
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

  it('should return correct application notification declination for Approved status', () => {
    const status = 'Approved';

    const declination = component.defineDeclination(status);

    expect(declination).toBe(NotificationDeclination.Application.Approved);
  });

  describe('onNavigate', () => {
    const notification: Notification = {
      type: undefined,
      action: undefined,
      userId: undefined,
      createdDateTime: undefined,
      data: {}
    };

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

  describe('onRead and onDelete', () => {
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
      component.notificationsAmount = { amount: 7 };
    });

    it('onReadAll should dispatch ReadAllUsersNotifications action, modify all notifications and clear amount', () => {
      jest.spyOn(store, 'dispatch');

      component.onReadAll();

      component.notificationsGroupedByType.forEach((notification) => expect(notification.isRead).toBeTruthy());
      component.notifications.forEach((notification) => expect(notification.readDateTime).toBeTruthy());
      expect(store.dispatch).toHaveBeenCalledWith(new ReadAllUsersNotifications());
      expect(component.notificationsAmount.amount).toBe(0);
    });

    it('onReadGroup should dispatch ReadUsersNotificationsByType action, modify all grouped notifications and reduce amount', () => {
      jest.spyOn(store, 'dispatch');

      const notificationsGroupedByType = component.notificationsGroupedByType[0];
      component.onReadGroup(notificationsGroupedByType);

      expect(store.dispatch).toHaveBeenCalledWith(new ReadUsersNotificationsByType(notificationsGroupedByType.type));
      expect(notificationsGroupedByType.isRead).toBeTruthy();
      expect(component.notificationsAmount.amount).toBe(3);
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
      expect(component.notificationsAmount.amount).toBe(6);
    });

    it('onReadGroup should skip if readDateTime already set', () => {
      jest.spyOn(store, 'dispatch');

      const notification = component.notifications[0];
      notification.readDateTime = new Date();
      component.onReadSingle(notification);

      expect(store.dispatch).not.toHaveBeenCalledWith(new ReadUsersNotificationById(notification));
    });

    it('onDeleteAll should call onReadAll and delete all notifications', () => {
      jest.spyOn(component, 'onReadAll');

      component.onDeleteAll();

      expect(component.notificationsGroupedByType.length).toBe(0);
      expect(component.notifications.length).toBe(0);
      expect(component.onReadAll).toHaveBeenCalled();
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
      component.notificationsAmount = { amount: 4 };
    });

    describe('notification group by additional data', () => {
      const notification: Notification = {
        type: NotificationType.Application,
        action: NotificationAction.Create,
        userId: undefined,
        createdDateTime: undefined,
        data: { Status: 'Pending' }
      };
      let initialNotificationsGroupedByTypeLength: number;
      let initialNotificationsAmount: number;

      beforeEach(() => {
        initialNotificationsGroupedByTypeLength = component.notificationsGroupedByType.length;
        initialNotificationsAmount = component.notificationsAmount.amount;
      });

      it('should add a new notification group to notifications grouped when received with additional data', () => {
        component.ngOnChanges({
          receivedNotification: {
            currentValue: notification,
            firstChange: false,
            previousValue: undefined,
            isFirstChange: undefined
          }
        });

        expect(component.notificationsGroupedByType.length).toBe(initialNotificationsGroupedByTypeLength + 1);
        expect(component.notificationsAmount.amount).toBe(initialNotificationsAmount + 1);
      });

      it('should add a new notification group to notifications grouped when received without additional data', () => {
        notification.data = {};

        component.ngOnChanges({
          receivedNotification: {
            currentValue: notification,
            firstChange: false,
            previousValue: undefined,
            isFirstChange: undefined
          }
        });

        expect(component.notificationsGroupedByType.length).toBe(initialNotificationsGroupedByTypeLength);
        expect(component.notificationsAmount.amount).toBe(initialNotificationsAmount + 1);
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
      const initialNotificationsAmount = component.notificationsAmount.amount;

      component.ngOnChanges({
        receivedNotification: {
          currentValue: notification,
          firstChange: false,
          previousValue: undefined,
          isFirstChange: undefined
        }
      });

      expect(component.notifications.length).toBe(initialNotificationsLength + 1);
      expect(component.notificationsAmount.amount).toBe(initialNotificationsAmount + 1);
    });
  });
});
