import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';

import { PersonalCabinetLinks } from '../../../../shared/enum/personal-cabinet-links';
import { Constants } from '../../../constants/constants';
import {
  ApplicationApproved, ApplicationChanges, ApplicationLeft, ApplicationPending, ApplicationRejected
} from '../../../enum/enumUA/declinations/notification-declination';
import { NoResultsTitle } from '../../../enum/enumUA/no-results';
import {
  NotificationProviderLicenseFullDescription, NotificationProviderLicenseShortDescription,
  NotificationsProviderFullDescriptions, NotificationsProviderShortDescriptions,
  NotificationWorkshopFullDescriptions, NotificationWorkshopShortDescription
} from '../../../enum/enumUA/notifications';
import {
  DataTypes, NotificationDescriptionType, NotificationType
} from '../../../enum/notifications';
import { Role } from '../../../enum/role';
import { ApplicationStatuses, LicenseStatuses, ProviderStatuses } from '../../../enum/statuses';
import {
  Notification, NotificationGroupedByAdditionalData, Notifications, NotificationsAmount,
  NotificationsGroupedByType
} from '../../../models/notifications.model';
import {
  ClearNotificationState, DeleteUsersNotificationById, GetAllUsersNotificationsGrouped,
  ReadUsersNotificationById, ReadUsersNotificationsByType
} from '../../../store/notifications.actions';
import { NotificationsState } from '../../../store/notifications.state';
import { RegistrationState } from '../../../store/registration.state';

@Component({
  selector: 'app-notifications-list',
  templateUrl: './notifications-list.component.html',
  styleUrls: ['./notifications-list.component.scss']
})
export class NotificationsListComponent implements OnInit, OnChanges, OnDestroy {
  readonly ApplicationHeaderDeclinations = ApplicationChanges;
  readonly NotificationDescriptionType = NotificationDescriptionType;
  readonly Constants = Constants;
  readonly NoResults = NoResultsTitle.noNotifications;

  @Input() public notificationsAmount: NotificationsAmount;
  @Input() public recievedNotification: Notification;

  @Select(NotificationsState.notifications)
  public notificationsData$: Observable<Notifications>;

  private destroy$: Subject<boolean> = new Subject<boolean>();

  public groupsByType: NotificationsGroupedByType[] = [];
  public notifications: Notification[];

  constructor(private store: Store, private router: Router) {}

  public ngOnChanges(changes: SimpleChanges): void {
    const recievedNotification = changes['recievedNotification'];
    if (recievedNotification && !recievedNotification.firstChange) {
      this.addRecievedNotification(recievedNotification.currentValue);
    }
  }

  public ngOnInit(): void {
    this.store.dispatch(new GetAllUsersNotificationsGrouped());
    this.notificationsData$
      .pipe(
        takeUntil(this.destroy$),
        filter((recievedNotifications: Notifications) => !!recievedNotifications)
      )
      .subscribe((recievedNotifications: Notifications) => {
        this.createGroupsByType(recievedNotifications);
        this.notifications = recievedNotifications.notifications;
      });
  }

  public onReadSingle(notification: Notification): void {
    if (notification.readDateTime) {
      return;
    }

    this.store.dispatch(new ReadUsersNotificationById(notification));

    notification.readDateTime = new Date(Date.now()).toISOString();
    this.notificationsAmount.amount--;
  }

  public onReadGroup(groupByType: NotificationsGroupedByType): void {
    if (groupByType.isRead) {
      return;
    }

    this.store.dispatch(new ReadUsersNotificationsByType(groupByType));

    this.notificationsAmount.amount -= groupByType.amount;
    groupByType.isRead = true;
  }

  public onReadAll(): void {
    this.groupsByType.forEach((groupByType: NotificationsGroupedByType) => this.onReadGroup(groupByType));
    this.notifications.forEach((notification: Notification) => this.onReadSingle(notification));
  }

  public onDeleteSingle(notification: Notification): void {
    this.store.dispatch(new DeleteUsersNotificationById(notification.id));

    this.notificationsAmount.amount--;
    this.notifications = this.notifications.filter((recievedNotification: Notification) => recievedNotification.id !== notification.id);
  }

  public onNavigate(type: NotificationType, groupedDataStatus?: ApplicationStatuses): void {
    switch (NotificationType[type]) {
      case NotificationType.Application:
        const userRole: Role = this.store.selectSnapshot<Role>(RegistrationState.role);
        const status: string = ApplicationStatuses[groupedDataStatus];
        this.router.navigate([`/personal-cabinet/${userRole}/${PersonalCabinetLinks.Application}`], {
          queryParams: { status: status }
        });
        break;
      case NotificationType.Chat:
        this.router.navigate([`/personal-cabinet/${PersonalCabinetLinks.Chat}`]);
        break;
      case NotificationType.Provider:
        this.router.navigate(['personal-cabinet/provider/info']);
        break;
    }
  }

  public stopPropagation(event: PointerEvent): void {
    event.stopPropagation();
  }

  public defineDeclination(
    status: string
  ): typeof ApplicationApproved | typeof ApplicationPending | typeof ApplicationRejected | typeof ApplicationLeft | typeof ApplicationLeft {
    switch (status) {
      case ApplicationStatuses.Approved:
        return ApplicationApproved;
      case ApplicationStatuses.Pending:
        return ApplicationPending;
      case ApplicationStatuses.Rejected:
        return ApplicationRejected;
      case ApplicationStatuses.Left:
        return ApplicationLeft;
      default:
        return ApplicationPending;
    }
  }

  public getNotificationDescription(
    descriptionType: NotificationDescriptionType,
    notificationType: NotificationType,
    data: DataTypes
  ): string | void {
    if (data[DataTypes.LicenseStatus]) {
      return this.getDataLicenseNotification(descriptionType, data[DataTypes.LicenseStatus]);
    } else if (data[DataTypes.Status]) {
      return this.getDataStatusNotification(descriptionType, notificationType, data[DataTypes.Status]);
    }
  }

  public ngOnDestroy(): void {
    this.store.dispatch(new ClearNotificationState());
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  private getDataStatusNotification(
    descriptionType: NotificationDescriptionType,
    notificationType: NotificationType,
    status: ApplicationStatuses | ProviderStatuses
  ): string {
    switch (descriptionType) {
      case NotificationDescriptionType.Full:
        switch (notificationType) {
          case NotificationType.Workshop:
            return NotificationWorkshopFullDescriptions[status];
          case NotificationType.Provider:
            return NotificationsProviderFullDescriptions[status];
        }
        break;
      case NotificationDescriptionType.Short:
        switch (notificationType) {
          case NotificationType.Workshop:
            return NotificationWorkshopShortDescription[status];
          case NotificationType.Provider:
            return NotificationsProviderShortDescriptions[status];
        }
        break;
      default:
        return Constants.NO_INFORMATION;
    }
  }

  private getDataLicenseNotification(descriptionType: NotificationDescriptionType, status: ApplicationStatuses | ProviderStatuses): string {
    switch (descriptionType) {
      case NotificationDescriptionType.Full:
        return NotificationProviderLicenseFullDescription[status];
      case NotificationDescriptionType.Short:
        return NotificationProviderLicenseShortDescription[status];
      default:
        return Constants.NO_INFORMATION;
    }
  }

  private createGroupsByType(recievedNotifications: Notifications): void {
    let groupsByType = new Map<string, NotificationsGroupedByType>();

    for (const group of recievedNotifications.notificationsGrouped) {
      const currentGroupByType = groupsByType.get(group.type);
      let newGroupByType: NotificationsGroupedByType;

      if (currentGroupByType) {
        currentGroupByType.groupsByAdditionalData.push(group);
        currentGroupByType.amount += group.amount;
        groupsByType.set(currentGroupByType.type, currentGroupByType);
      } else {
        newGroupByType = new NotificationsGroupedByType(group.type, group.amount, [group]);
        groupsByType.set(newGroupByType.type, newGroupByType);
      }
    }

    groupsByType.forEach((groupByType: NotificationsGroupedByType) => this.groupsByType.push(groupByType));
  }

  private addRecievedNotification(recievedNotification: Notification): void {
    this.notificationsAmount.amount++;

    if (recievedNotification.type !== NotificationType.Application && recievedNotification.type !== NotificationType.Chat) {
      this.notifications.push(recievedNotification);
      return;
    }

    for (const groupByType of this.groupsByType) {
      if (groupByType.type === recievedNotification.type) {
        for (const groupByAction of groupByType.groupsByAdditionalData) {
          if (groupByAction.groupedData === recievedNotification.data.Status) {
            groupByType.amount++;
            groupByAction.amount++;

            return;
          }
        }

        this.addNewGroupByAdditionalData(groupByType, recievedNotification);
        return;
      }
    }

    this.addNewGroupByType(recievedNotification);
  }

  private addNewGroupByAdditionalData(groupByType: NotificationsGroupedByType, recievedNotification: Notification): void {
    switch (recievedNotification.type) {
      case NotificationType.Application:
        groupByType.groupsByAdditionalData.push(
          new NotificationGroupedByAdditionalData(recievedNotification.action, recievedNotification.data.Status, recievedNotification.type)
        );
        break;
      case NotificationType.Chat:
        //TODO
        break;
    }
  }

  private addNewGroupByType(recievedNotification: Notification): void {
    const newGroupByType = new NotificationsGroupedByType(recievedNotification.type, 1, []);
    this.addNewGroupByAdditionalData(newGroupByType, recievedNotification);
    this.groupsByType.push(newGroupByType);
  }
}
