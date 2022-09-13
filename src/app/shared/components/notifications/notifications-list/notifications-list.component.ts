import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { ApplicationStatus } from 'src/app/shared/enum/applications';
import { ApplicationApproved, ApplicationLeft, ApplicationPending, ApplicationRejected } from 'src/app/shared/enum/enumUA/declinations/notification-declination';
import { Role } from 'src/app/shared/enum/role';
import { RegistrationState } from 'src/app/shared/store/registration.state';
import { NotificationsConstants } from '../../../constants/constants';
import { ApplicationTitlesReverse } from '../../../enum/enumUA/applications';
import { NotificationType } from '../../../enum/notifications';
import { NotificationGrouped, Notifications, NotificationsAmount, Notification } from '../../../models/notifications.model';
import { GetAllUsersNotificationsGrouped, ReadUsersNotificationById, ReadUsersNotificationsByType } from '../../../store/notifications.actions';
import { NotificationsState } from '../../../store/notifications.state';

@Component({
  selector: 'app-notifications-list',
  templateUrl: './notifications-list.component.html',
  styleUrls: ['./notifications-list.component.scss']
})
export class NotificationsListComponent implements OnInit, OnDestroy {

  @Select(NotificationsState.notificationsAmount)
  notificationsAmount$: Observable<NotificationsAmount>;
  @Select(NotificationsState.notifications)
  notificationsData$: Observable<Notifications>;
  notificationsAmount: number;
  destroy$: Subject<boolean> = new Subject<boolean>();
  userRole: Role;
  
  readonly notificationsConstants = NotificationsConstants;


  constructor(
    private store: Store,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.store.dispatch(new GetAllUsersNotificationsGrouped());
    this.notificationsAmount$.pipe(
      takeUntil(this.destroy$),
      filter((notificationsAmount: NotificationsAmount) => !!notificationsAmount)
    ).subscribe((notificationsAmount: NotificationsAmount) => {
      this.notificationsAmount = notificationsAmount.amount;
      this.getNotifications();
    });
  }

  private getNotifications(): void {
    if (this.notificationsAmount) {
      this.store.dispatch(new GetAllUsersNotificationsGrouped());
    }
  }

  onReadGroup(notificationsGrouped: NotificationGrouped): void {
    this.store.dispatch(new ReadUsersNotificationsByType(notificationsGrouped));
    this.userRole = this.store.selectSnapshot<Role>(RegistrationState.role);
    switch (NotificationType[notificationsGrouped.type]) {
      case NotificationType.Application:
        let status: string = ApplicationStatus[notificationsGrouped.groupedData];
        this.router.navigate([`/personal-cabinet/${this.userRole}/${NotificationType.Application}/`], { relativeTo: this.route, queryParams: { status: status } });
        break;
      case NotificationType.Workshop:
        break;
      case NotificationType.Chat:
        break;
    }
  }

  onReadSingle(event: PointerEvent, notification: Notification): void {
    this.store.dispatch(new ReadUsersNotificationById(notification));
    event.stopPropagation();
  }

  defineDeclination(status: string) {
    let declination;
    switch (status) {
      case 'Approved':
        declination = ApplicationApproved;
      break;
      case 'Pending':
        declination = ApplicationPending;
      break;
      case 'Rejected':
        declination = ApplicationRejected;
      break;
      case 'Left':
        declination = ApplicationLeft;
        break;    
      default:
        declination = ApplicationPending;
        break;
    }

    return declination;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
