import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngxs/store';

import { Constants } from 'shared/constants/constants';
import { NotificationDescriptions } from 'shared/enum/enumUA/notifications';
import { ApplicationTitles } from 'shared/enum/enumUA/statuses';
import { NotificationAction, NotificationDataType, NotificationDescriptionType, NotificationType } from 'shared/enum/notifications';
import { Role } from 'shared/enum/role';
import { Notification } from 'shared/models/notification.model';
import { RegistrationState } from 'shared/store/registration.state';

@Pipe({
  name: 'notificationDescription'
})
export class NotificationDescriptionPipe implements PipeTransform {
  private static role: Role;

  constructor(
    private translateService: TranslateService,
    store: Store
  ) {
    if (!NotificationDescriptionPipe.role) {
      NotificationDescriptionPipe.role = store.selectSnapshot(RegistrationState.role);
    }
  }

  public transform(notification: Notification, descriptionType: NotificationDescriptionType): string {
    let description: string = null;

    description = NotificationDescriptions.get(descriptionType, notification.type, notification.action);
    if (descriptionType === NotificationDescriptionType.Full || (notification.data && Object.keys(notification.data).length)) {
      switch (notification.type) {
        case NotificationType.Application:
          description = ApplicationTitles[notification.data.Status];
          break;
        case NotificationType.Workshop:
          description =
            NotificationDescriptions.get(descriptionType, notification.type, notification.data.Status) ??
            NotificationDescriptions.get(descriptionType, notification.type, notification.action);
          break;
        case NotificationType.Provider:
        case NotificationType.System: {
          const status = notification.data.Status;
          switch (notification.action) {
            case NotificationAction.Update:
              description =
                NotificationDescriptions.get(descriptionType, NotificationDataType.Status, status) ??
                NotificationDescriptions.get(descriptionType, notification.type, status);
              break;
            case NotificationAction.LicenseApproval:
              description = NotificationDescriptions.get(descriptionType, NotificationDataType.LicenseStatus, status);
              break;
          }
        }
      }
    }

    return this.translateService.instant(description ?? Constants.NO_INFORMATION);
  }
}
