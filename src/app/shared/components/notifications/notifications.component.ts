import { AfterViewChecked, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject, combineLatest, filter, takeUntil } from 'rxjs';

import { NOTIFICATION_HUB_URL } from 'shared/constants/hubs-url';
import { Notification, NotificationAmount } from 'shared/models/notification.model';
import { SignalRService } from 'shared/services/signalR/signal-r.service';
import { AppState } from 'shared/store/app.state';
import { GetUnreadMessagesCount } from 'shared/store/chat.actions';
import { ChatState } from 'shared/store/chat.state';
import { GetAmountOfNewUsersNotifications } from 'shared/store/notification.actions';
import { NotificationState } from 'shared/store/notification.state';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit, AfterViewChecked, OnDestroy {
  @Select(NotificationState.notificationsAmount)
  public notificationsAmount$: Observable<NotificationAmount>;
  @Select(ChatState.unreadMessagesCount)
  public unreadMessagesCount$: Observable<number>;
  @Select(AppState.isMobileScreen)
  public isMobileScreen$: Observable<boolean>;

  public notificationsAmount: NotificationAmount;
  public receivedNotification: Notification;
  private hubConnection: signalR.HubConnection;

  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private store: Store,
    private cdr: ChangeDetectorRef,
    private signalRService: SignalRService
  ) {}

  public ngOnInit(): void {
    this.hubConnection = this.signalRService.startConnection(NOTIFICATION_HUB_URL);

    this.store.dispatch([new GetAmountOfNewUsersNotifications(), new GetUnreadMessagesCount()]);
    this.hubConnection.on('ReceiveNotification', (receivedNotificationString: string) => {
      // TODO: solve the problem with keys with capital letters
      const parsedNotification = JSON.parse(receivedNotificationString);
      this.receivedNotification = {
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

    combineLatest([this.notificationsAmount$.pipe(filter(Boolean)), this.unreadMessagesCount$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([notificationsAmount, unreadMessagesCount]: [NotificationAmount, number]) => {
        this.notificationsAmount = { ...notificationsAmount };
        if (unreadMessagesCount) {
          this.notificationsAmount.amount = notificationsAmount.amount + unreadMessagesCount;
        }
      });
  }

  public ngAfterViewChecked(): void {
    this.cdr.detectChanges();
  }

  public ngOnDestroy(): void {
    this.hubConnection.stop();
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
