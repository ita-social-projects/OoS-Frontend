import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { NotificationsConstants } from 'src/app/shared/constants/constants';
import { NotificationGrouped, Notifications, Notification, NotificationsAmount } from 'src/app/shared/models/notifications.model';
import { GetAllUsersNotificationsGrouped, ReadUsersNotificationById, ReadUsersNotificationsByType } from 'src/app/shared/store/notifications.actions';
import { NotificationsState } from 'src/app/shared/store/notifications.state';
import { Util } from 'src/app/shared/utils/utils';

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


  constructor(private store: Store) { }

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
  }

  onReadSingle(event: PointerEvent, notification: Notification): void {
    this.store.dispatch(new ReadUsersNotificationById(notification));
    event.stopPropagation();
  }

  getDeclensionNewApplication(applicationAmount: number): string {
    return Util.getDeclensionNewApplication(applicationAmount);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
