import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';

import { PersonalCabinetLinks } from 'shared/enum/personal-cabinet-links';
import { Constants } from 'shared/constants/constants';
import {
  ApplicationApproved,
  ApplicationChanges,
  ApplicationLeft,
  ApplicationPending,
  ApplicationRejected
} from 'shared/enum/enumUA/declinations/notification-declination';
import { NoResultsTitle } from 'shared/enum/enumUA/no-results';
import {
  NotificationProviderLicenseFullDescription,
  NotificationProviderLicenseShortDescription,
  NotificationsProviderFullDescriptions,
  NotificationsProviderShortDescriptions,
  NotificationWorkshopFullDescriptions,
  NotificationWorkshopShortDescription
} from 'shared/enum/enumUA/notifications';
import { DataTypes, NotificationAction, NotificationDescriptionType, NotificationType } from 'shared/enum/notifications';
import { Role } from 'shared/enum/role';
import { ApplicationStatuses, ProviderStatuses } from 'shared/enum/statuses';
import {
  Notification,
  NotificationGroupedByAdditionalData,
  Notifications,
  NotificationsAmount,
  NotificationsGroupedByType
} from 'shared/models/notifications.model';
import {
  ClearNotificationState,
  DeleteUsersNotificationById,
  GetAllUsersNotificationsGrouped,
  ReadUsersNotificationById,
  ReadUsersNotificationsByType
} from 'shared/store/notifications.actions';
import { NotificationsState } from 'shared/store/notifications.state';
import { RegistrationState } from 'shared/store/registration.state';

@Component({
  selector: 'app-notifications-list',
  templateUrl: './notifications-list.component.html',
  styleUrls: ['./notifications-list.component.scss']
})
export class NotificationsListComponent implements OnInit, OnChanges, OnDestroy {
  public readonly ApplicationHeaderDeclinations = ApplicationChanges;
  public readonly NotificationDescriptionType = NotificationDescriptionType;
  public readonly Constants = Constants;
  public readonly NoResults = NoResultsTitle.noNotifications;

  @Input() public notificationsAmount: NotificationsAmount;
  @Input() public recievedNotification: Notification;

  @Select(NotificationsState.notifications)
  public notificationsData$: Observable<Notifications>;

  private destroy$: Subject<boolean> = new Subject<boolean>();

  public groupsByType: NotificationsGroupedByType[] = [];
  public notifications: Notification[];

  constructor(
    private store: Store,
    private router: Router
  ) {}

  public ngOnChanges(changes: SimpleChanges): void {
    const recievedNotification = changes.recievedNotification;
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
        this.groupsByType = recievedNotifications.notificationsGroupedByType;
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

    this.store.dispatch(new ReadUsersNotificationsByType(groupByType.type));

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

  public onNavigate(type: NotificationType, action: NotificationAction, groupedDataStatus?: ApplicationStatuses): void {
    switch (NotificationType[type]) {
      case NotificationType.Workshop:
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
        switch (NotificationAction[action]) {
          case NotificationAction.Block:
            this.router.navigate(['personal-cabinet/provider/info']);
            break;
          default:
            this.router.navigate(['admin-tools/data/provider-list']);
            break;
        }
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
    data: DataTypes,
    action: ProviderStatuses
  ): string | void {
    if (data[DataTypes.LicenseStatus]) {
      return this.getDataLicenseNotification(descriptionType, data[DataTypes.LicenseStatus]);
    }

    if (!Object.keys(data).length) {
      return this.getNotificationByAction(descriptionType, notificationType, action);
    }

    if (data[DataTypes.Status]) {
      return this.getDataStatusNotification(descriptionType, notificationType, data[DataTypes.Status]);
    }
  }

  public ngOnDestroy(): void {
    this.store.dispatch(new ClearNotificationState());
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  private getNotificationByAction(
    descriptionType: NotificationDescriptionType,
    notificationType: NotificationType,
    action: ProviderStatuses
  ): string | void {
    if (descriptionType === NotificationDescriptionType.Full) {
      return this.getFullNotificationMessage(notificationType, action);
    }

    if (descriptionType === NotificationDescriptionType.Short) {
      return this.getShortNotificationMessage(notificationType, action);
    }

    return Constants.NO_INFORMATION;
  }

  private getDataStatusNotification(
    descriptionType: NotificationDescriptionType,
    notificationType: NotificationType,
    status: ApplicationStatuses | ProviderStatuses
  ): string {
    switch (descriptionType) {
      case NotificationDescriptionType.Full:
        return this.getFullNotificationMessage(notificationType, status);
      case NotificationDescriptionType.Short:
        return this.getShortNotificationMessage(notificationType, status);
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

  private addRecievedNotification(recievedNotification: Notification): void {
    this.notificationsAmount.amount++;

    if (recievedNotification.type !== NotificationType.Application && recievedNotification.type !== NotificationType.Chat) {
      this.notifications.push(recievedNotification);
      return;
    }

    for (const groupByType of this.groupsByType) {
      if (groupByType.type === recievedNotification.type) {
        for (const groupByAction of groupByType.groupedByAdditionalData) {
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
        groupByType.groupedByAdditionalData.push(
          new NotificationGroupedByAdditionalData(recievedNotification.action, recievedNotification.data.Status, recievedNotification.type)
        );
        break;
      case NotificationType.Chat:
        // TODO
        break;
    }
  }

  private addNewGroupByType(recievedNotification: Notification): void {
    const newGroupByType = new NotificationsGroupedByType(recievedNotification.type, 1, []);
    this.addNewGroupByAdditionalData(newGroupByType, recievedNotification);
    this.groupsByType.push(newGroupByType);
  }

  private getFullNotificationMessage(
    notificationType: NotificationType,
    input: ProviderStatuses | NotificationAction | ApplicationStatuses
  ): string {
    if (notificationType === NotificationType.Workshop) {
      return NotificationWorkshopFullDescriptions[input];
    }

    if (notificationType === NotificationType.Provider) {
      return NotificationsProviderFullDescriptions[input];
    }
  }

  private getShortNotificationMessage(
    notificationType: NotificationType,
    input: ProviderStatuses | NotificationAction | ApplicationStatuses
  ): string {
    if (notificationType === NotificationType.Workshop) {
      return NotificationWorkshopShortDescription[input];
    }

    if (notificationType === NotificationType.Provider) {
      return NotificationsProviderShortDescriptions[input];
    }
  }
}
