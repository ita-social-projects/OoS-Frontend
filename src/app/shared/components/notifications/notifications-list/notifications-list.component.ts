import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  readonly notificationsConstants = NotificationsConstants;
  readonly notificationWorkshopStatusUkr = NotificationWorkshopStatusUkr;
  readonly statuses = Statuses;
  readonly notificationText = NotificationsText;
  readonly ApplicationHeaderDeclinations = ApplicationHeader;

  @Input() notificationsAmount: NotificationsAmount;

  @Select(NotificationsState.notifications)
  notificationsData$: Observable<Notifications>;

  destroy$: Subject<boolean> = new Subject<boolean>();
  notificationsGroupedByType: NotificationsGroupedByType[] = [];
  notifications: Notification[];

  constructor(private store: Store, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.store.dispatch(new GetAllUsersNotificationsGrouped());
    this.notificationsData$.pipe(filter((not: Notifications) => !!not)).subscribe((not: Notifications) => {
      console.log(not);
      console.log(222);
      let map = new Map<string, number>();

      for (const group of not.notificationsGrouped) {
        const curNotificationsAmount = map.get(group.type);
        const newNotificationsAmount = curNotificationsAmount ? curNotificationsAmount + group.amount : group.amount;
        map.set(group.type, newNotificationsAmount);
      }

      map.forEach((amount, type) => this.notificationsGroupedByType.push({ type, amount, isRead: false }));
      this.notifications = not.notifications;
    });
  }

  onReadGroup(event: PointerEvent, notificationsGrouped: NotificationsGroupedByType): void {
    this.store.dispatch(new ReadUsersNotificationsByType(notificationsGrouped));

    this.notificationsAmount.amount -= notificationsGrouped.amount;
    notificationsGrouped.isRead = true;

    event.stopPropagation();
  }

  onReadSingle(event: PointerEvent, notification: Notification): void {
    this.store.dispatch(new ReadUsersNotificationById(notification));
    notification.readDateTime = new Date(Date.now()).toISOString();

    this.notificationsAmount.amount--;

    event.stopPropagation();
  }

  onReadAll(event: PointerEvent) {
    this.notificationsGroupedByType.forEach((group: NotificationsGroupedByType) => {
      this.store.dispatch(new ReadUsersNotificationsByType(group));
      group.isRead = true;
    });
    this.notifications.forEach((notification: Notification) => {
      this.store.dispatch(new ReadUsersNotificationById(notification));
      notification.readDateTime = new Date(Date.now()).toISOString();
    });

    this.notificationsAmount.amount = 0;

    event.stopPropagation();
  }
  //TODO: onDeleteGroup

  onDeleteSingle(event: PointerEvent, notification: Notification) {
    this.store.dispatch(new DeleteUsersNotificationById(notification.id));

    this.notifications.filter((notificationItem: Notification) => notificationItem.id != notification.id);

    event.stopPropagation();
  }

  onGroupByStatusClick(group: NotificationGrouped) {
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

  onRead(event: PointerEvent) {
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
}
