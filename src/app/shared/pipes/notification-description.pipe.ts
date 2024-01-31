import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { Constants } from 'shared/constants/constants';
import { NotificationDescriptions } from 'shared/enum/enumUA/notifications';
import { NotificationDescriptionType } from 'shared/enum/notifications';
import { Notification } from 'shared/models/notification.model';

@Pipe({
  name: 'notificationDescription'
})
export class NotificationDescriptionPipe implements PipeTransform {
  constructor(private translateService: TranslateService) {}

  transform(notification: Notification, descriptionType: NotificationDescriptionType): unknown {
    let translate = null;

    if (NotificationDescriptions.notificationDescriptionExists(descriptionType, notification.type, notification.action)) {
      translate = NotificationDescriptions.toNotificationDescription(descriptionType, notification.type, notification.action);
    }

    return translate ? this.translateService.instant(translate) : Constants.NO_INFORMATION;
  }
}
