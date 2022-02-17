import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { NotificationTypeUkr } from '../../enum/enumUA/notifications';
import { NotificationType } from '../../enum/notifications';
import { NotificationsAmount, Notifications, NotificationGrouped, Notification } from '../../models/notifications.model';
import { GetAllUsersNotificationsGrouped, GetAmountOfNewUsersNotifications, ReadUsersNotificationById, ReadUsersNotificationsByType } from '../../store/notifications.actions';
import { NotificationsState } from '../../store/notifications.state';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit, OnDestroy {

  readonly notificationType = NotificationType;
  readonly notificationTypeUkr = NotificationTypeUkr;

  @Select(NotificationsState.notificationsAmount)
  notificationsAmount$: Observable<NotificationsAmount>;
  @Select(NotificationsState.notifications)
  notificationsData$: Observable<Notifications>
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private store: Store,
  ) { }

  ngOnInit(): void {
    this.store.dispatch(new GetAmountOfNewUsersNotifications());
  }

  getNotifications(): void {
    this.store.dispatch(new GetAllUsersNotificationsGrouped());
  }

  onReadGroup(notificationsGrouped: NotificationGrouped): void {
    this.store.dispatch(new ReadUsersNotificationsByType(notificationsGrouped));
  }

  onReadSingle(notification: Notification): void {
    this.store.dispatch(new ReadUsersNotificationById(notification));
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
