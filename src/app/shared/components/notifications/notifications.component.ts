import { AfterViewChecked, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Actions, Select, Store, ofActionSuccessful } from '@ngxs/store';
import { BehaviorSubject, EMPTY, Observable, Subject, combineLatest, filter, map, switchMap, takeUntil } from 'rxjs';

import { NOTIFICATION_HUB_URL } from 'shared/constants/hubs-url';
import { NotificationType } from 'shared/enum/notifications';
import { Notification, NotificationAmount } from 'shared/models/notification.model';
import { SignalRService } from 'shared/services/signalR/signal-r.service';
import { AppState } from 'shared/store/app.state';
import { GetUnreadMessagesCount } from 'shared/store/chat.actions';
import { ChatState } from 'shared/store/chat.state';
import { GetAmountOfNewUsersNotifications, ReadUsersNotificationsByType } from 'shared/store/notification.actions';
import { NotificationState } from 'shared/store/notification.state';
import { RegistrationState } from 'shared/store/registration.state';
import { isRoleAdmin } from 'shared/utils/admin.utils';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit, AfterViewChecked, OnDestroy {
  @Select(NotificationState.notificationAmount)
  public notificationAmount$: Observable<NotificationAmount>;
  @Select(ChatState.unreadMessagesCount)
  public unreadMessagesCount$: Observable<number>;
  @Select(AppState.isMobileScreen)
  public isMobileScreen$: Observable<boolean>;

  public notificationAmount: NotificationAmount;
  public receivedNotification: Notification;
  private hubConnection: signalR.HubConnection;

  private unreadNotificationsCount$ = new BehaviorSubject<number>(null);
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private store: Store,
    private cdr: ChangeDetectorRef,
    private signalRService: SignalRService,
    private actions$: Actions
  ) {}

  public ngOnInit(): void {
    this.hubConnection = this.signalRService.startConnection(NOTIFICATION_HUB_URL);
    const role = this.store.selectSnapshot(RegistrationState.role);

    this.store.dispatch(new GetAmountOfNewUsersNotifications());
    if (!isRoleAdmin(role)) {
      this.store.dispatch(new GetUnreadMessagesCount());
    }
    this.hubConnection.on('ReceiveNotification', (receivedNotificationString: string) => {
      // TODO: solve the problem with keys with capital letters
      const { unreadNotificationsCount, newNotificationDto: parsedNotification } = JSON.parse(receivedNotificationString);
      this.unreadNotificationsCount$.next(unreadNotificationsCount);
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

    this.actions$
      .pipe(
        ofActionSuccessful(ReadUsersNotificationsByType),
        switchMap((payload) =>
          payload.notificationType === NotificationType.Application && payload.needGetRequest
            ? this.store.dispatch(new GetAmountOfNewUsersNotifications())
            : EMPTY
        ),
        filter(Boolean),
        takeUntil(this.destroy$)
      )
      .subscribe((notificationAmount) => this.unreadNotificationsCount$.next(notificationAmount.amount));

    combineLatest([
      this.notificationAmount$.pipe(filter(Boolean)),
      this.unreadNotificationsCount$,
      this.unreadMessagesCount$.pipe(filter((unreadMessagesCount) => isRoleAdmin(role) || unreadMessagesCount !== null))
    ])
      .pipe(
        map(([notificationAmount, unreadNotificationsCount, unreadMessagesCount]: [NotificationAmount, number, number]) => [
          unreadNotificationsCount ?? notificationAmount.amount,
          unreadMessagesCount
        ]),
        takeUntil(this.destroy$)
      )
      .subscribe(
        ([notificationAmount, unreadMessagesCount]: [number, number]) =>
          (this.notificationAmount = { amount: notificationAmount + unreadMessagesCount })
      );
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
