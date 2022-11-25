import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { Constants, NotificationsConstants } from '../../../constants/constants';
import { Statuses } from '../../../enum/statuses';
import {
  ApplicationApproved,
  ApplicationPending,
  ApplicationRejected,
  ApplicationLeft,
  ApplicationChanges
} from '../../../enum/enumUA/declinations/notification-declination';
import {
  NotificationsProviderFullDescriptions,
  NotificationsProviderShortDescriptions,
  NotificationWorkshopShortDescription,
  NotificationWorkshopFullDescriptions
} from '../../../enum/enumUA/notifications';
import { NotificationDescriptionType, NotificationType } from '../../../enum/notifications';
import { Role } from '../../../enum/role';
import {
  NotificationsGroupedByType,
  NotificationGroupedByAdditionalData,
  Notifications,
  NotificationsAmount,
  Notification
} from '../../../models/notifications.model';
import {
  ClearNotificationState,
  DeleteUsersNotificationById,
  GetAllUsersNotificationsGrouped,
  ReadUsersNotificationById,
  ReadUsersNotificationsByType
} from '../../../store/notifications.actions';
import { NotificationsState } from '../../../store/notifications.state';
import { RegistrationState } from '../../../store/registration.state';
import { PersonalCabinetLinks } from '../../../../shared/enum/personal-cabinet-links';

@Component({
  selector: 'app-notifications-list',
  templateUrl: './notifications-list.component.html',
  styleUrls: ['./notifications-list.component.scss']
})
export class NotificationsListComponent implements OnInit, OnChanges, OnDestroy {
  readonly NotificationsConstants = NotificationsConstants;
  readonly ApplicationHeaderDeclinations = ApplicationChanges;
  readonly NotificationDescriptionType = NotificationDescriptionType;
  readonly Constants = Constants;

  @Input() notificationsAmount: NotificationsAmount;
  @Input() recievedNotification: Notification;

  @Select(NotificationsState.notifications)
  notificationsData$: Observable<Notifications>;

  destroy$: Subject<boolean> = new Subject<boolean>();
  groupsByType: NotificationsGroupedByType[] = [];
  notifications: Notification[];

  constructor(private store: Store, private router: Router) {}

  ngOnChanges(changes: SimpleChanges): void {
    const recievedNotification = changes['recievedNotification'];
    if (recievedNotification && !recievedNotification.firstChange) {
      this.addRecievedNotification(recievedNotification.currentValue);
    }
  }

  ngOnInit(): void {
    this.store.dispatch(new GetAllUsersNotificationsGrouped());
    this.notificationsData$
      .pipe(
        takeUntil(this.destroy$),
        filter((recievedNotifications: Notifications) => !!recievedNotifications)
      )
      .subscribe((recievedNotifications: Notifications) => {
        this.createGroupsByType(recievedNotifications);
        this.notifications = recievedNotifications.notifications;
      });
  }

  onReadSingle(notification: Notification): void {
    this.store.dispatch(new ReadUsersNotificationById(notification));

    notification.readDateTime = new Date(Date.now()).toISOString();
    this.notificationsAmount.amount--;
  }

  //TODO: Implement read group by status(Pending, Edit, etc..)

  onReadGroup(groupByType: NotificationsGroupedByType): void {
    this.store.dispatch(new ReadUsersNotificationsByType(groupByType));

    this.notificationsAmount.amount -= groupByType.amount;
    groupByType.isRead = true;
  }

  onReadAll(): void {
    this.groupsByType.forEach((groupByType: NotificationsGroupedByType) => {
      this.onReadGroup(groupByType);
    });
    this.notifications.forEach((notification: Notification) => {
      this.onReadSingle(notification);
    });
  }

  //TODO: Implemented onDeleteAll

  onDeleteSingle(notification: Notification): void {
    this.store.dispatch(new DeleteUsersNotificationById(notification.id));

    this.notificationsAmount.amount--;
    this.notifications = this.notifications.filter((recievedNotification: Notification) => recievedNotification.id != notification.id);
  }

  onGroupByStatusClick(group: NotificationGroupedByAdditionalData): void {
    switch (NotificationType[group.type]) {
      case NotificationType.Application:
        const userRole: Role = this.store.selectSnapshot<Role>(RegistrationState.role);
        const status: string = Statuses[group.groupedData];
        this.router.navigate([`/personal-cabinet/${userRole}/${PersonalCabinetLinks.Application}`], {
          queryParams: { status: status }
        });
        break;
      case NotificationType.Chat:
        this.router.navigate([`/personal-cabinet/${PersonalCabinetLinks.Chat}`]);
        break;
    }
  }

  stopPropagation(event: PointerEvent) {
    event.stopPropagation();
  }

  defineDeclination(
    status: string
  ): typeof ApplicationApproved | typeof ApplicationPending | typeof ApplicationRejected | typeof ApplicationLeft | typeof ApplicationLeft {
    switch (status) {
      case Statuses.Approved:
        return ApplicationApproved;
      case Statuses.Pending:
        return ApplicationPending;
      case Statuses.Rejected:
        return ApplicationRejected;
      case Statuses.Left:
        return ApplicationLeft;
      default:
        return ApplicationPending;
    }
  }

  getNotificationDescription(descriptionType: NotificationDescriptionType, notificationType: NotificationType, status: Statuses): string {
    switch (descriptionType) {
      case NotificationDescriptionType.Full:
        switch (notificationType) {
          case NotificationType.Workshop:
            return NotificationWorkshopFullDescriptions[status];
          case NotificationType.Provider:
            return NotificationsProviderShortDescriptions[status];
        }
        break;
      case NotificationDescriptionType.Short:
        switch (notificationType) {
          case NotificationType.Workshop:
            return NotificationWorkshopShortDescription[status];
          case NotificationType.Provider:
            return NotificationsProviderFullDescriptions[status];
        }
        break;
      default:
        return Constants.NO_INFORMATION;
    }
  }

  ngOnDestroy(): void {
    this.store.dispatch(new ClearNotificationState());
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  private createGroupsByType(recievedNotifications: Notifications): void {
    let groupsByType = new Map<string, NotificationsGroupedByType>();

    for (const group of recievedNotifications.notificationsGrouped) {
      const curGroupByType = groupsByType.get(group.type);
      let newGroupByType: NotificationsGroupedByType;

      if (curGroupByType) {
        curGroupByType.groupsByAdditionalData.push(group);
        curGroupByType.amount += group.amount;
        groupsByType.set(curGroupByType.type, curGroupByType);
      } else {
        newGroupByType = new NotificationsGroupedByType(group.type, group.amount, [group]);
        groupsByType.set(newGroupByType.type, newGroupByType);
      }
    }

    groupsByType.forEach((groupByType: NotificationsGroupedByType) => this.groupsByType.push(groupByType));
  }

  private addRecievedNotification(recievedNotification: Notification): void {
    this.notificationsAmount.amount++;

    if (recievedNotification.type !== NotificationType.Application && recievedNotification.type !== NotificationType.Chat) {
      this.notifications.push(recievedNotification);
      return;
    }

    for (const groupByType of this.groupsByType) {
      if (groupByType.type === recievedNotification.type) {
        for (const groupByAction of groupByType.groupsByAdditionalData) {
          if (groupByAction.groupedData === recievedNotification.data.Status) {
            groupByType.amount++;
            groupByAction.amount++;

            return;
          }
        }

        this.addNewGroupByAdditionalData(groupByType, recievedNotification);
        return;
      }
    }

    this.addNewGroupByType(recievedNotification);
  }

  private addNewGroupByAdditionalData(groupByType: NotificationsGroupedByType, recievedNotification: Notification): void {
    switch (recievedNotification.type) {
      case NotificationType.Application:
        groupByType.groupsByAdditionalData.push(
          new NotificationGroupedByAdditionalData(recievedNotification.action, recievedNotification.data.Status, recievedNotification.type)
        );
        break;
      case NotificationType.Chat:
        //TODO
        break;
    }
  }

  private addNewGroupByType(recievedNotification: Notification) {
    const newGroupByType = new NotificationsGroupedByType(recievedNotification.type, 1, []);
    this.addNewGroupByAdditionalData(newGroupByType, recievedNotification);
    this.groupsByType.push(newGroupByType);
  }
}
