import { Component, Input, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { NotificationsAmount } from '../../models/notifications.model';
import { User } from '../../models/user.model';
import { GetAmountOfNewUsersNotifications } from '../../store/notifications.actions';
import { NotificationsState } from '../../store/notifications.state';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  // @Input() user: User;

  @Select(NotificationsState.notificationsAmount)
  notificationsAmount$: Observable<NotificationsAmount>;

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(new GetAmountOfNewUsersNotifications());
  }

}
