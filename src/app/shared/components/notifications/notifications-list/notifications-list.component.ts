import { Component, OnDestroy, OnInit } from '@angular/core';
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
  ApplicationLeft
} from '../../../enum/enumUA/declinations/notification-declination';
import { NotificationsText } from '../../../enum/enumUA/notifications';
import { NotificationWorkshopStatusUkr } from '../../../enum/enumUA/workshop';
import { NotificationType } from '../../../enum/notifications';
import { Role } from '../../../enum/role';
import { NotificationGrouped, Notifications, NotificationsAmount, Notification } from '../../../models/notifications.model';
import {
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
  @Select(NotificationsState.notificationsAmount)
  notificationsAmount$: Observable<NotificationsAmount>;
  @Select(NotificationsState.notifications)
  notificationsData$: Observable<Notifications>;
  notificationsAmount: number;
  destroy$: Subject<boolean> = new Subject<boolean>();

  readonly notificationsConstants = NotificationsConstants;
  readonly notificationWorkshopStatusUkr = NotificationWorkshopStatusUkr;
  readonly statuses = Statuses;
  readonly notificationText = NotificationsText;

  constructor(private store: Store, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.store.dispatch(new GetAllUsersNotificationsGrouped());
    this.notificationsAmount$
      .pipe(
        takeUntil(this.destroy$),
        filter((notificationsAmount: NotificationsAmount) => !!notificationsAmount)
      )
      .subscribe((notificationsAmount: NotificationsAmount) => {
        this.notificationsAmount = notificationsAmount.amount;
        this.getNotifications();
      });
  }

  private getNotifications(): void {
    if (this.notificationsAmount) {
      this.store.dispatch(new GetAllUsersNotificationsGrouped());
    }
  }

  onReadGroup(notificationsGrouped: NotificationGrouped): void {
    this.store.dispatch(new ReadUsersNotificationsByType(notificationsGrouped));
    const userRole: Role = this.store.selectSnapshot<Role>(RegistrationState.role);
    switch (NotificationType[notificationsGrouped.type]) {
      case NotificationType.Application:
        const status: string = Statuses[notificationsGrouped.groupedData];
        this.router.navigate([`/personal-cabinet/${userRole}/${NotificationType.Application}/`], {
          relativeTo: this.route,
          queryParams: { status: status }
        });
        break;
      case NotificationType.Workshop:
        break;
      case NotificationType.Chat:
        break;
    }
  }

  onReadSingle(event: PointerEvent, notification: Notification): void {
    this.store.dispatch(new ReadUsersNotificationById(notification));
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
