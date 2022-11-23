import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { filter, Observable, Subject, takeUntil } from 'rxjs';
import { NOTIFICATION_HUB_URL } from '../../constants/hubs-Url';
import { NotificationsAmount } from '../../models/notifications.model';
import { SignalRService } from '../../services/signalR/signal-r.service';
import { AppState } from '../../store/app.state';
import { GetAmountOfNewUsersNotifications } from '../../store/notifications.actions';
import { NotificationsState } from '../../store/notifications.state';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit, OnDestroy {
  @Select(NotificationsState.notificationsAmount)
  notificationsAmount$: Observable<NotificationsAmount>;
  @Select(AppState.isMobileScreen)
  isMobileScreen$: Observable<boolean>;

  notificationsAmount: NotificationsAmount;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private store: Store, private signalRService: SignalRService) {}

  ngOnInit(): void {
    const hubConnection = this.signalRService.startConnection(NOTIFICATION_HUB_URL);

    this.store.dispatch(new GetAmountOfNewUsersNotifications());
    hubConnection.on('ReceiveNotification', () => this.notificationsAmount.amount++);

    this.notificationsAmount$
      .pipe(
        takeUntil(this.destroy$),
        filter((notificationsAmount: NotificationsAmount) => !!notificationsAmount)
      )
      .subscribe((notificationsAmount: NotificationsAmount) => (this.notificationsAmount = notificationsAmount));
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
