import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { Constants } from 'shared/constants/constants';
import {
  ApplicationApproved,
  ApplicationChanges,
  ApplicationLeft,
  ApplicationPending,
  ApplicationRejected
} from 'shared/enum/enumUA/declinations/notification-declination';
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
  ReadUsersNotificationById,
  ReadUsersNotificationsByType
} from 'shared/store/notification.actions';
import { NotificationState } from 'shared/store/notification.state';
import { RegistrationState } from 'shared/store/registration.state';

@Component({
  selector: 'app-notifications-list',
  templateUrl: './notifications-list.component.html',
  styleUrls: ['./notifications-list.component.scss']
})
export class NotificationsListComponent implements OnInit, OnChanges, OnDestroy {
  @Input() public notificationsAmount: NotificationAmount;
  @Input() public recievedNotification: Notification;

  @Select(NotificationState.notifications)
  public notificationsData$: Observable<NotificationGroupedAndSingle>;

  public readonly ApplicationHeaderDeclinations = ApplicationChanges;
  public readonly NotificationDescriptionType = NotificationDescriptionType;
  public readonly Constants = Constants;
  public readonly NoResults = NoResultsTitle.noNotifications;

  public notificationsGroupedByType: NotificationGroupedByType[] = [];
  public notifications: Notification[];

  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private store: Store,
    private router: Router
  ) {}

  public ngOnInit(): void {
    this.store.dispatch(new GetAllUsersNotificationsGrouped());
    this.notificationsData$
      .pipe(takeUntil(this.destroy$), filter(Boolean))
      .subscribe((recievedNotifications: NotificationGroupedAndSingle) => {
        this.notificationsGroupedByType = recievedNotifications.notificationsGroupedByType;
        this.notifications = recievedNotifications.notifications;
      });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    const recievedNotification = changes.recievedNotification;
    if (recievedNotification && !recievedNotification.firstChange) {
      this.addRecievedNotification(recievedNotification.currentValue);
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

  public defineDeclination(
    status: string
  ): typeof ApplicationApproved | typeof ApplicationPending | typeof ApplicationRejected | typeof ApplicationLeft | typeof ApplicationLeft {
    switch (status) {
      case ApplicationStatuses.Approved:
        return ApplicationApproved;
      case ApplicationStatuses.Pending:
        return ApplicationPending;
      case ApplicationStatuses.Rejected:
        return ApplicationRejected;
      case ApplicationStatuses.Left:
        return ApplicationLeft;
      default:
        return ApplicationPending;
    }
  }

  public onNavigate(type: NotificationType, action: NotificationAction, groupedDataStatus?: ApplicationStatuses): void {
    switch (NotificationType[type]) {
      case NotificationType.Workshop:
      case NotificationType.Application:
        const userRole: Role = this.store.selectSnapshot<Role>(RegistrationState.role);
        const status: string = ApplicationStatuses[groupedDataStatus];
        this.router.navigate([`/personal-cabinet/${userRole}/${PersonalCabinetLinks.Application}`], {
          queryParams: { status: status }
        });
        break;
      case NotificationType.Chat:
        this.router.navigate([`/personal-cabinet/${PersonalCabinetLinks.Chat}`]);
        break;
      case NotificationType.Provider:
        switch (NotificationAction[action]) {
          case NotificationAction.Block:
            this.router.navigate(['personal-cabinet/provider/info']);
            break;
          default:
            this.router.navigate(['admin-tools/data/provider-list']);
            break;
        }
    }
  }

  public onReadAll(): void {
    this.notificationsGroupedByType.forEach((groupByType: NotificationGroupedByType) => this.onReadGroup(groupByType));
    this.notifications.forEach((notification: Notification) => this.onReadSingle(notification));
  }

  public onReadGroup(groupByType: NotificationGroupedByType): void {
    if (groupByType.isRead) {
      return;
    }

    this.store.dispatch(new ReadUsersNotificationsByType(groupByType.type));

    this.notificationsAmount.amount -= groupByType.amount;
    groupByType.isRead = true;
  }

  public onReadSingle(notification: Notification): void {
    if (notification.readDateTime) {
      return;
    }

    this.store.dispatch(new ReadUsersNotificationById(notification));

    notification.readDateTime = new Date(Date.now());
    this.notificationsAmount.amount--;
  }

  public onDeleteAll(): void {
    // this.store.dispatch();
    // TODO: Uncomment & add action when there will be new endpoint
    this.notificationsAmount.amount = 0;
    this.notifications = [];
  }

  public onDeleteSingle(notification: Notification): void {
    this.store.dispatch(new DeleteUsersNotificationById(notification.id));

    this.notificationsAmount.amount--;
    this.notifications = this.notifications.filter((recievedNotification: Notification) => recievedNotification.id !== notification.id);
  }

  // TODO: Remove
  // private getNotificationByType(descriptionType: NotificationDescriptionType, notification: Notification): string {
  //   const descriptions = (Object.entries(notification.data) as [NotificationDataType, string][])
  //     .map(([dataType, value]) => {
  //       let translation = null;

  //       if (NotificationDescriptions.notificationDescriptionExists(descriptionType, dataType, value)) {
  //         translation = NotificationDescriptions.toNotificationDescription(descriptionType, dataType, value);
  //       }

  //       return translation && this.translateService.instant(translation);
  //     })
  //     .filter(Boolean);

  //   return descriptions.length ? descriptions.join('.') + '.' : Constants.NO_INFORMATION;
  // }

  private addRecievedNotification(recievedNotification: Notification): void {
    this.notificationsAmount.amount++;

    if (recievedNotification.type !== NotificationType.Application && recievedNotification.type !== NotificationType.Chat) {
      this.notifications.push(recievedNotification);
      return;
    }

    for (const notificationGroupedByType of this.notificationsGroupedByType) {
      if (notificationGroupedByType.type === recievedNotification.type) {
        for (const notificationGrouped of notificationGroupedByType.groupedByAdditionalData) {
          if (notificationGrouped.groupedData === recievedNotification.data[NotificationDataType.Status]) {
            notificationGroupedByType.amount++;
            notificationGrouped.amount++;
            return;
          }
        }

        this.addNewGroupByAdditionalData(notificationGroupedByType, recievedNotification);
        return;
      }
    }

    this.addNewGroupByType(recievedNotification);
  }

  private addNewGroupByType(recievedNotification: Notification): void {
    const newGroupByType = new NotificationGroupedByType(recievedNotification.type, 1, []);
    this.addNewGroupByAdditionalData(newGroupByType, recievedNotification);
    this.notificationsGroupedByType.push(newGroupByType);
  }

  private addNewGroupByAdditionalData(groupByType: NotificationGroupedByType, recievedNotification: Notification): void {
    switch (recievedNotification.type) {
      case NotificationType.Application:
        groupByType.groupedByAdditionalData.push(
          new NotificationGrouped(
            recievedNotification.type,
            recievedNotification.action,
            recievedNotification.data[NotificationDataType.Status]
          )
        );
        break;
      case NotificationType.Chat:
        // TODO
        break;
    }
  }
}
