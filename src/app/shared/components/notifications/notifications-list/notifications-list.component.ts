import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject, combineLatest, filter, takeUntil } from 'rxjs';

import { Constants } from 'shared/constants/constants';
import { NotificationDeclination } from 'shared/enum/enumUA/declinations/notification-declination';
import { NoResultsTitle } from 'shared/enum/enumUA/no-results';
import { NotificationAction, NotificationDataType, NotificationDescriptionType, NotificationType } from 'shared/enum/notifications';
import { PersonalCabinetLinks } from 'shared/enum/personal-cabinet-links';
import { Role } from 'shared/enum/role';
import { ApplicationStatuses } from 'shared/enum/statuses';
import {
  Notification,
  NotificationAmount,
  NotificationGrouped,
  NotificationGroupedAndSingle,
  NotificationGroupedByType
} from 'shared/models/notification.model';
import { ChatState } from 'shared/store/chat.state';
import {
  ClearNotificationState,
  GetAllUsersNotificationsGrouped,
  ReadAllUsersNotifications,
  ReadUsersNotificationById,
  ReadUsersNotificationsByType
} from 'shared/store/notification.actions';
import { NotificationState } from 'shared/store/notification.state';
import { GetPendingApplicationsByProviderId } from 'shared/store/provider.actions';
import { RegistrationState } from 'shared/store/registration.state';
import { isRoleProvider } from 'shared/utils/provider.utils';
import { Util } from 'shared/utils/utils';

@Component({
  selector: 'app-notifications-list',
  templateUrl: './notifications-list.component.html',
  styleUrls: ['./notifications-list.component.scss']
})
export class NotificationsListComponent implements OnInit, OnChanges, OnDestroy {
  @Input() public notificationAmount: NotificationAmount;
  @Input() public receivedNotification: Notification;

  @Select(NotificationState.notifications)
  public notificationsData$: Observable<NotificationGroupedAndSingle>;
  @Select(ChatState.unreadMessagesCount)
  public unreadMessagesCount$: Observable<number>;

  public readonly ApplicationHeaderDeclinations = NotificationDeclination.Application.Changes;
  public readonly NotificationDescriptionType = NotificationDescriptionType;
  public readonly Constants = Constants;
  public readonly Util = Util;
  public readonly NoResults = NoResultsTitle.noNotifications;

  public notificationsGroupedByType: NotificationGroupedByType[] = [];
  public notifications: Notification[];
  private role: Role;

  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private store: Store,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.store.dispatch(new GetAllUsersNotificationsGrouped());
    this.role = this.store.selectSnapshot(RegistrationState.role);
    combineLatest([this.notificationsData$.pipe(filter(Boolean)), this.unreadMessagesCount$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([receivedNotifications, unreadMessagesCount]: [NotificationGroupedAndSingle, number]) => {
        this.notificationsGroupedByType = receivedNotifications.notificationsGroupedByType;
        this.notifications = receivedNotifications.notifications;
        if (unreadMessagesCount) {
          this.notificationsGroupedByType = this.notificationsGroupedByType.filter(
            (notification) => notification.type !== NotificationType.Chat
          );
          this.notificationsGroupedByType.unshift({
            type: NotificationType.Chat,
            amount: unreadMessagesCount,
            groupedByAdditionalData: [
              {
                type: NotificationType.Chat,
                amount: unreadMessagesCount,
                groupedData: 'Unread'
              }
            ]
          });
        }
      });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    const receivedNotification = changes.receivedNotification;
    if (receivedNotification && !receivedNotification.firstChange) {
      this.addReceivedNotification(receivedNotification.currentValue);
    }
  }

  public ngOnDestroy(): void {
    this.store.dispatch(new ClearNotificationState());
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public stopPropagation(event: PointerEvent): void {
    event.stopPropagation();
  }

  public defineDeclination(notification: NotificationGrouped, status?: string): NotificationDeclination.DeclinationType {
    return NotificationDeclination.getDeclination(notification.type, status || notification.groupedData);
  }

  public onNavigate(notification: Notification, groupedData?: string): void {
    if (notification.action === NotificationAction.Delete) {
      return;
    }

    switch (NotificationType[notification.type]) {
      case NotificationType.Workshop:
        this.router.navigate(['details/workshop', notification.objectId]);
        break;
      case NotificationType.Application:
        {
          const status = ApplicationStatuses[groupedData] as string;
          this.router.navigate(['personal-cabinet', this.role, PersonalCabinetLinks.Application], {
            queryParams: { status }
          });
        }
        break;
      case NotificationType.Chat:
        this.router.navigate(['personal-cabinet', PersonalCabinetLinks.Chat]);
        break;
      case NotificationType.Provider:
        switch (NotificationAction[notification.action]) {
          case NotificationAction.Block:
          case NotificationAction.Unblock:
            this.router.navigate(['personal-cabinet/provider/info']);
            break;
          default:
            this.router.navigate(['admin-tools/data/provider-list']);
            break;
        }
        break;
      case NotificationType.Parent:
        switch (NotificationAction[notification.action]) {
          case NotificationAction.ProviderBlock:
          case NotificationAction.ProviderUnblock:
            this.router.navigate(['details/provider', notification.data?.ProviderId]);
            break;
        }
    }
  }

  public onReadAll(): void {
    this.store.dispatch(new ReadAllUsersNotifications());
    this.notificationsGroupedByType.forEach((notification) => (notification.isRead = true));
    this.notifications.forEach((notification) => (notification.readDateTime = new Date()));
    this.notificationAmount.amount = 0;
  }

  public onReadGroup(groupByType: NotificationGroupedByType): void {
    if (groupByType.isRead) {
      return;
    }

    this.store.dispatch(new ReadUsersNotificationsByType(groupByType.type));

    groupByType.isRead = true;
    this.notificationAmount.amount -= groupByType.amount;
  }

  public onReadSingle(notification: Notification): void {
    if (notification.readDateTime) {
      return;
    }

    this.store.dispatch(new ReadUsersNotificationById(notification));

    notification.readDateTime = new Date();
    this.notificationAmount.amount--;
  }

  private addReceivedNotification(receivedNotification: Notification): void {
    if (receivedNotification.type !== NotificationType.Application && receivedNotification.type !== NotificationType.Chat) {
      this.notifications.unshift(receivedNotification);
      return;
    } else if (receivedNotification.type === NotificationType.Application && isRoleProvider(this.role)) {
      const providerId = this.store.selectSnapshot(RegistrationState.provider).id;
      this.store.dispatch(new GetPendingApplicationsByProviderId(providerId));
    }

    const newNotificationGroupReceived = this.notificationsGroupedByType.every((notificationGroupedByType) => {
      if (notificationGroupedByType.type === receivedNotification.type) {
        let receivedGroupExistsByAdditionalData = false;
        notificationGroupedByType.groupedByAdditionalData.forEach((notificationGrouped) => {
          notificationGroupedByType.amount++;
          if (notificationGrouped.groupedData === receivedNotification.data[NotificationDataType.Status]) {
            notificationGrouped.amount++;
            receivedGroupExistsByAdditionalData = true;
          }
        });
        if (!receivedGroupExistsByAdditionalData) {
          this.addNewGroupByAdditionalData(notificationGroupedByType, receivedNotification);
        }
        return false;
      }
      return true;
    });

    if (newNotificationGroupReceived) {
      this.addNewGroupByType(receivedNotification);
    }
  }

  private addNewGroupByType(receivedNotification: Notification): void {
    const newGroupByType = new NotificationGroupedByType(receivedNotification.type, 1, []);
    this.addNewGroupByAdditionalData(newGroupByType, receivedNotification);
    this.notificationsGroupedByType.unshift(newGroupByType);
  }

  private addNewGroupByAdditionalData(groupByType: NotificationGroupedByType, receivedNotification: Notification): void {
    switch (receivedNotification.type) {
      case NotificationType.Application:
        groupByType.groupedByAdditionalData.unshift(
          new NotificationGrouped(
            receivedNotification.type,
            receivedNotification.action,
            receivedNotification.data[NotificationDataType.Status]
          )
        );
        break;
    }
  }
}
