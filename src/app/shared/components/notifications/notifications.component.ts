import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatMenu } from '@angular/material/menu';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { NotificationType } from '../../enum/notifications';
import { NotificationsAmount, Notifications, NotificationGrouped, Notification } from '../../models/notifications.model';
import { AppState } from '../../store/app.state';
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
  @Select(AppState.isMobileScreen)
  isMobileScreen$: Observable<boolean>;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private store: Store,
  ) { }

  ngOnInit(): void {
    this.store.dispatch(new GetAmountOfNewUsersNotifications());
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
