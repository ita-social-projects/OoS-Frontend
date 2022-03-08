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
export class NotificationsComponent implements OnInit {
  @Select(NotificationsState.notificationsAmount)
  notificationsAmount$: Observable<NotificationsAmount>;
  @Select(AppState.isMobileScreen)
  isMobileScreen$: Observable<boolean>;

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(new GetAmountOfNewUsersNotifications());
  }
}
