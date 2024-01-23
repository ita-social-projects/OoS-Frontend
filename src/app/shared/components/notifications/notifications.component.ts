import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject, filter, takeUntil } from 'rxjs';

import { NOTIFICATION_HUB_URL } from 'shared/constants/hubs-url';
import { Notification, NotificationsAmount } from 'shared/models/notifications.model';
import { SignalRService } from 'shared/services/signalR/signal-r.service';
import { AppState } from 'shared/store/app.state';
import { GetAmountOfNewUsersNotifications } from 'shared/store/notifications.actions';
import { NotificationsState } from 'shared/store/notifications.state';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit, OnDestroy {
  @Select(NotificationsState.notificationsAmount)
  public notificationsAmount$: Observable<NotificationsAmount>;
  @Select(AppState.isMobileScreen)
  public isMobileScreen$: Observable<boolean>;

  private hubConnection: signalR.HubConnection;

  public notificationsAmount: NotificationsAmount;
  public recievedNotification: Notification;
  public destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private store: Store, private signalRService: SignalRService) {}

  public ngOnInit(): void {
    this.hubConnection = this.signalRService.startConnection(NOTIFICATION_HUB_URL);

    this.store.dispatch(new GetAmountOfNewUsersNotifications());
    this.hubConnection.on('ReceiveNotification', (recievedNotificationString: string) => {
      //TODO: solve the problem with keys with capital letters
      const parsedNotification = JSON.parse(recievedNotificationString);
      this.recievedNotification = {
        id: parsedNotification.Id,
        userId: parsedNotification.UserId,
        data: parsedNotification.Data,
        type: parsedNotification.Type,
        action: parsedNotification.Action,
        createdDateTime: parsedNotification.CreatedDateTime,
        readDateTime: parsedNotification.ReadDateTime,
        objectId: parsedNotification.ObjectId
      };
    });

    this.notificationsAmount$
      .pipe(
        takeUntil(this.destroy$),
        filter((notificationsAmount: NotificationsAmount) => !!notificationsAmount)
      )
      .subscribe((notificationsAmount: NotificationsAmount) => (this.notificationsAmount = notificationsAmount));
  }

  public ngOnDestroy(): void {
    this.hubConnection.stop();
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
