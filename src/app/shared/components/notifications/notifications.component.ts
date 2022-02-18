import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatMenu } from '@angular/material/menu';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { NotificationType } from '../../enum/notifications';
import { NotificationsAmount, Notifications, NotificationGrouped, Notification } from '../../models/notifications.model';
import { GetAllUsersNotificationsGrouped, GetAmountOfNewUsersNotifications, ReadUsersNotificationById, ReadUsersNotificationsByType } from '../../store/notifications.actions';
import { NotificationsState } from '../../store/notifications.state';
import { Util } from '../../utils/utils';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit, OnDestroy {
  @Select(NotificationsState.notificationsAmount)
  notificationsAmount$: Observable<NotificationsAmount>;
  notificationsAmount: number;
  @Select(NotificationsState.notifications)
  notificationsData$: Observable<Notifications>
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private store: Store,
  ) { }

  ngOnInit(): void {
    this.store.dispatch(new GetAmountOfNewUsersNotifications());
    this.notificationsAmount$.pipe(
      takeUntil(this.destroy$),
      filter((notificationsAmount: NotificationsAmount) => !!notificationsAmount)
    ).subscribe((notificationsAmount: NotificationsAmount) => this.notificationsAmount = notificationsAmount.amount);
  }

  getNotifications(): void {
    if (this.notificationsAmount) {
      this.store.dispatch(new GetAllUsersNotificationsGrouped());
    }
  }

  onReadGroup(notificationsGrouped: NotificationGrouped): void {
    this.store.dispatch(new ReadUsersNotificationsByType(notificationsGrouped));
  }

  onReadSingle(event: PointerEvent, notification: Notification): void {
    this.store.dispatch(new ReadUsersNotificationById(notification));
    event.stopPropagation()
  }

  getDeclensionNewApplication(applicationAmount: number): string {
    return Util.getDeclensionNewApplication(applicationAmount);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
