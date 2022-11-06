import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { NotificationsAmount } from '../../models/notifications.model';
import { AppState } from '../../store/app.state';
import { GetAmountOfNewUsersNotifications } from '../../store/notifications.actions';
import { NotificationsState } from '../../store/notifications.state';

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

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(new GetAmountOfNewUsersNotifications());
  }
}
