import { Notification } from 'shared/models/notification.model';
import { NotificationAction, NotificationDataType, NotificationDescriptionType, NotificationType } from '../notifications';
import { ProviderStatusDetails } from './statuses';

export namespace NotificationDescriptions {
  export namespace Short {
    export enum LicenseStatus {
      Approved = 'NOTIFICATION_DETAILS.LICENSE_SHORT_DESCRIPTION.APPROVED',
      Pending = 'NOTIFICATION_DETAILS.LICENSE_SHORT_DESCRIPTION.PENDING',
      NotProvided = 'NOTIFICATION_DETAILS.LICENSE_SHORT_DESCRIPTION.NOT_PROVIDED'
    }

    export enum Provider {
      Editing = 'NOTIFICATION_DETAILS.PROVIDER_SHORT_DESCRIPTION.EDITING',
      Approved = 'NOTIFICATION_DETAILS.PROVIDER_SHORT_DESCRIPTION.APPROVED',
      Block = 'NOTIFICATION_DETAILS.PROVIDER_SHORT_DESCRIPTION.BLOCK',
      Unblock = 'NOTIFICATION_DETAILS.PROVIDER_SHORT_DESCRIPTION.UNBLOCK',
      Update = 'ENUM.PROVIDER_STATUS_DETAILS.EDITING'
    }

    export enum Workshop {
      Open = 'NOTIFICATION_DETAILS.WORKSHOP_SHORT_DESCRIPTION.OPEN',
      Closed = 'NOTIFICATION_DETAILS.WORKSHOP_SHORT_DESCRIPTION.CLOSED'
    }

    export enum Parent {
      ProviderBlock = 'Blocked by provider'
    }
  }

  export namespace Full {
    export enum LicenseStatus {
      Approved = 'NOTIFICATION_DETAILS.LICENSE_FULL_DESCRIPTION.APPROVED',
      Pending = 'NOTIFICATION_DETAILS.LICENSE_FULL_DESCRIPTION.PENDING',
      NotProvided = 'NOTIFICATION_DETAILS.LICENSE_FULL_DESCRIPTION.NOT_PROVIDED'
    }

    export enum Provider {
      Editing = 'NOTIFICATION_DETAILS.PROVIDER_FULL_DESCRIPTION.EDITING',
      Approved = 'NOTIFICATION_DETAILS.PROVIDER_FULL_DESCRIPTION.APPROVED',
      Block = 'NOTIFICATION_DETAILS.PROVIDER_FULL_DESCRIPTION.BLOCK',
      Unblock = 'NOTIFICATION_DETAILS.PROVIDER_FULL_DESCRIPTION.UNBLOCK',
      Update = 'ENUM.PROVIDER_STATUS_DETAILS.EDITING'
    }

    export enum Workshop {
      Open = 'NOTIFICATION_DETAILS.WORKSHOP_FULL_DESCRIPTION.OPEN',
      Closed = 'NOTIFICATION_DETAILS.WORKSHOP_FULL_DESCRIPTION.CLOSED'
    }

    export enum Parent {
      ProviderBlock = 'Blocked by provider'
    }
  }

  export function notificationDescriptionExists(
    descriptionType: NotificationDescriptionType,
    notificationType: NotificationType | NotificationDataType,
    notificationAction: NotificationAction | string
  ): boolean {
    return (
      descriptionType in NotificationDescriptions &&
      notificationType in NotificationDescriptions[descriptionType] &&
      notificationAction in NotificationDescriptions[descriptionType][notificationType]
    );
  }

  export function toNotificationDescription(
    descriptionType: NotificationDescriptionType,
    type: NotificationType | NotificationDataType,
    action: NotificationAction | string
  ): string {
    return NotificationDescriptions[descriptionType][type][action];
  }
}
