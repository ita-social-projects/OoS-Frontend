import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { NotificationsConstants } from '../../../constants/constants';
import { ApplicationStatus } from '../../../enum/applications';
import { ApplicationTitles, ApplicationTitlesReverse } from '../../../enum/enumUA/applications';
import { NotificationAction, NotificationType } from '../../../enum/notifications';
import { Role } from '../../../enum/role';
import { NotificationGrouped, Notifications, NotificationsAmount, Notification } from '../../../models/notifications.model';
import { GetAllUsersNotificationsGrouped, ReadUsersNotificationById, ReadUsersNotificationsByType } from '../../../store/notifications.actions';
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


  constructor(
    private store: Store,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.store.dispatch(new GetAllUsersNotificationsGrouped());
    this.notificationsAmount$.pipe(
      takeUntil(this.destroy$),
      filter((notificationsAmount: NotificationsAmount) => !!notificationsAmount)
    ).subscribe((notificationsAmount: NotificationsAmount) => {
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

    switch (NotificationType[notificationsGrouped.type]) {
      case NotificationType.Application:
        let status: string = ApplicationTitlesReverse[notificationsGrouped.groupedData];
        this.router.navigate([`/personal-cabinet/${NotificationType.Application}/${[status]}`]);
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

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
