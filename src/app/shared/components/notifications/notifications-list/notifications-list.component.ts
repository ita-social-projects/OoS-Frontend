import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

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
import {
  ClearNotificationState,
  DeleteUsersNotificationById,
  GetAllUsersNotificationsGrouped,
  ReadAllUsersNotifications,
  ReadUsersNotificationById,
  ReadUsersNotificationsByType
} from 'shared/store/notification.actions';
import { NotificationState } from 'shared/store/notification.state';
import { RegistrationState } from 'shared/store/registration.state';
import { Util } from 'shared/utils/utils';

@Component({
  selector: 'app-notifications-list',
  templateUrl: './notifications-list.component.html',
  styleUrls: ['./notifications-list.component.scss']
})
export class NotificationsListComponent implements OnInit, OnChanges, OnDestroy {
  @Input() public notificationsAmount: NotificationAmount;
  @Input() public receivedNotification: Notification;

  @Select(NotificationState.notifications)
  public notificationsData$: Observable<NotificationGroupedAndSingle>;

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
    this.notificationsData$
      .pipe(takeUntil(this.destroy$), filter(Boolean))
      .subscribe((receivedNotifications: NotificationGroupedAndSingle) => {
        this.notificationsGroupedByType = receivedNotifications.notificationsGroupedByType;
        this.notifications = receivedNotifications.notifications;
      });
    this.role = this.store.selectSnapshot(RegistrationState.role);
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

  public defineDeclination(status: string): NotificationDeclination.Application.DeclinationType {
    return NotificationDeclination.Application.getDeclination(status);
  }

  public onNavigate(notification: Notification, groupedData?: string): void {
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
    this.notificationsAmount.amount = 0;
  }

  public onReadGroup(groupByType: NotificationGroupedByType): void {
    if (groupByType.isRead) {
      return;
    }

    this.store.dispatch(new ReadUsersNotificationsByType(groupByType.type));

    groupByType.isRead = true;
    this.notificationsAmount.amount -= groupByType.amount;
  }

  public onReadSingle(notification: Notification): void {
    if (notification.readDateTime) {
      return;
    }

    this.store.dispatch(new ReadUsersNotificationById(notification));

    notification.readDateTime = new Date();
    this.notificationsAmount.amount--;
  }

  public onDeleteAll(): void {
    this.notificationsGroupedByType = [];
    this.notifications = [];
    this.onReadAll();
  }

  // TODO: Consider deleting because of unused
  public onDeleteSingle(notification: Notification): void {
    this.store.dispatch(new DeleteUsersNotificationById(notification.id));

    this.notificationsAmount.amount--;
    this.notifications = this.notifications.filter((receivedNotification: Notification) => receivedNotification.id !== notification.id);
  }

  private addReceivedNotification(receivedNotification: Notification): void {
    this.notificationsAmount.amount++;

    if (receivedNotification.type !== NotificationType.Application && receivedNotification.type !== NotificationType.Chat) {
      this.notifications.unshift(receivedNotification);
      return;
    }

    const newNotificationGroupReceived = this.notificationsGroupedByType.some((notificationGroupedByType) => {
      if (notificationGroupedByType.type === receivedNotification.type) {
        const receivedGroupExistsByAdditionalData = notificationGroupedByType.groupedByAdditionalData.some((notificationGrouped) => {
          if (notificationGrouped.groupedData === receivedNotification.data[NotificationDataType.Status]) {
            notificationGroupedByType.amount++;
            notificationGrouped.amount++;
            return true;
          }
          return false;
        });

        if (!receivedGroupExistsByAdditionalData) {
          this.addNewGroupByAdditionalData(notificationGroupedByType, receivedNotification);
          return false;
        }
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
    this.notificationsGroupedByType.push(newGroupByType);
  }

  private addNewGroupByAdditionalData(groupByType: NotificationGroupedByType, receivedNotification: Notification): void {
    switch (receivedNotification.type) {
      case NotificationType.Application:
        groupByType.groupedByAdditionalData.push(
          new NotificationGrouped(
            receivedNotification.type,
            receivedNotification.action,
            receivedNotification.data[NotificationDataType.Status]
          )
        );
        break;
      case NotificationType.Chat:
        // TODO: Add notifications grouped by new messages
        break;
    }
  }
}
