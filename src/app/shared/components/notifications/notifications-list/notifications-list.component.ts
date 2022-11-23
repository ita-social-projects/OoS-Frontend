import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { NotificationsConstants } from '../../../constants/constants';
import { Statuses } from '../../../enum/statuses';
import {
  ApplicationApproved,
  ApplicationPending,
  ApplicationRejected,
  ApplicationLeft,
  ApplicationHeader
} from '../../../enum/enumUA/declinations/notification-declination';
import { NotificationsText } from '../../../enum/enumUA/notifications';
import { NotificationWorkshopStatusUkr } from '../../../enum/enumUA/workshop';
import { NotificationType } from '../../../enum/notifications';
import { Role } from '../../../enum/role';
import {
  NotificationsGroupedByType,
  NotificationGrouped,
  Notifications,
  NotificationsAmount,
  Notification
} from '../../../models/notifications.model';
import {
  DeleteUsersNotificationById,
  GetAllUsersNotificationsGrouped,
  ReadUsersNotificationById,
  ReadUsersNotificationsByType
} from '../../../store/notifications.actions';
import { NotificationsState } from '../../../store/notifications.state';
import { RegistrationState } from '../../../store/registration.state';

@Component({
  selector: 'app-notifications-list',
  templateUrl: './notifications-list.component.html',
  styleUrls: ['./notifications-list.component.scss']
})
export class NotificationsListComponent implements OnInit, OnDestroy {
  //TODO: Add styles for no applications
  readonly NotificationsConstants = NotificationsConstants;
  //TODO: Implement notifications for the workshop
  readonly NotificationWorkshopStatusUkr = NotificationWorkshopStatusUkr;
  readonly NotificationText = NotificationsText;
  readonly ApplicationHeaderDeclinations = ApplicationHeader;

  @Input() notificationsAmount: NotificationsAmount;

  @Select(NotificationsState.notifications)
  notificationsData$: Observable<Notifications>;

  destroy$: Subject<boolean> = new Subject<boolean>();
  groupsByType: NotificationsGroupedByType[] = [];
  notifications: Notification[];

  constructor(private store: Store, private router: Router) {}

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
    this.notifications.filter((recievedNotification: Notification) => recievedNotification.id != notification.id);
  }

  onGroupByStatusClick(group: NotificationGrouped): void {
    switch (NotificationType[group.type]) {
      case NotificationType.Application:
        const userRole: Role = this.store.selectSnapshot<Role>(RegistrationState.role);
        const status: string = Statuses[group.groupedData];
        this.router.navigate([`/personal-cabinet/${userRole}/${NotificationType.Application}`], {
          queryParams: { status: status }
        });
        break;
      case NotificationType.Workshop:
        this.router.navigate([`/personal-cabinet/provider/${NotificationType.Workshop}`]);
        break;
      case NotificationType.Chat:
        this.router.navigate([`/personal-cabinet/${NotificationType.Chat}`]);
        break;
      //TODO: Add navigate to "Provider" application type
    }
  }

  stopPropagation(event: PointerEvent) {
    event.stopPropagation();
  }

  defineDeclination(status: string): number {
    let declination;
    switch (status) {
      case Statuses.Approved:
        declination = ApplicationApproved;
        break;
      case Statuses.Pending:
        declination = ApplicationPending;
        break;
      case Statuses.Rejected:
        declination = ApplicationRejected;
        break;
      case Statuses.Left:
        declination = ApplicationLeft;
        break;
      default:
        declination = ApplicationPending;
        break;
    }

    return declination;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  private createGroupsByType(recievedNotifications: Notifications): void {
    let groupsByType = new Map<string, number>();

    for (const group of recievedNotifications.notificationsGrouped) {
      const curNotificationsAmount = groupsByType.get(group.type);
      const newNotificationsAmount = curNotificationsAmount ? curNotificationsAmount + group.amount : group.amount;
      groupsByType.set(group.type, newNotificationsAmount);
    }

    groupsByType.forEach((amount, type) => this.groupsByType.push({ type, amount, isRead: false }));
  }
}
