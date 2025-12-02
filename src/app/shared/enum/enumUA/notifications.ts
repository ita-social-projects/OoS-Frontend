import { NotificationAction, NotificationDataType, NotificationDescriptionType, NotificationType } from '../notifications';

export namespace NotificationDescriptions {
  export namespace Short {
    export enum LicenseStatus {
      Approved = 'NOTIFICATION_DETAILS.LICENSE_SHORT_DESCRIPTION.APPROVED',
      Pending = 'NOTIFICATION_DETAILS.LICENSE_SHORT_DESCRIPTION.PENDING',
      NotProvided = 'NOTIFICATION_DETAILS.LICENSE_SHORT_DESCRIPTION.NOT_PROVIDED'
    }

    export enum Provider {
      Create = 'NOTIFICATION_DETAILS.PROVIDER_SHORT_DESCRIPTION.CREATE',
      Approved = 'NOTIFICATION_DETAILS.PROVIDER_SHORT_DESCRIPTION.APPROVED',
      Editing = 'NOTIFICATION_DETAILS.PROVIDER_SHORT_DESCRIPTION.EDITING',
      Recheck = 'NOTIFICATION_DETAILS.PROVIDER_SHORT_DESCRIPTION.RECHECK',
      Block = 'NOTIFICATION_DETAILS.PROVIDER_SHORT_DESCRIPTION.BLOCK',
      Unblock = 'NOTIFICATION_DETAILS.PROVIDER_SHORT_DESCRIPTION.UNBLOCK'
    }

    export enum Workshop {
      Open = 'NOTIFICATION_DETAILS.WORKSHOP_SHORT_DESCRIPTION.OPEN',
      Closed = 'NOTIFICATION_DETAILS.WORKSHOP_SHORT_DESCRIPTION.CLOSED',
      Delete = 'NOTIFICATION_DETAILS.WORKSHOP_SHORT_DESCRIPTION.DELETED'
    }

    export enum Parent {
      ProviderBlock = 'NOTIFICATION_DETAILS.PARENT_SHORT_DESCRIPTION.BLOCKED_BY_PROVIDER',
      ProviderUnblock = 'NOTIFICATION_DETAILS.PARENT_SHORT_DESCRIPTION.UNBLOCKED_BY_PROVIDER'
    }
  }

  export namespace Full {
    export enum LicenseStatus {
      Approved = 'NOTIFICATION_DETAILS.LICENSE_FULL_DESCRIPTION.APPROVED',
      Pending = 'NOTIFICATION_DETAILS.LICENSE_FULL_DESCRIPTION.PENDING',
      NotProvided = 'NOTIFICATION_DETAILS.LICENSE_FULL_DESCRIPTION.NOT_PROVIDED'
    }

    export enum Provider {
      Create = 'NOTIFICATION_DETAILS.PROVIDER_FULL_DESCRIPTION.CREATE',
      Approved = 'NOTIFICATION_DETAILS.PROVIDER_FULL_DESCRIPTION.APPROVED',
      Editing = 'NOTIFICATION_DETAILS.PROVIDER_FULL_DESCRIPTION.EDITING',
      Recheck = 'NOTIFICATION_DETAILS.PROVIDER_FULL_DESCRIPTION.RECHECK',
      Block = 'NOTIFICATION_DETAILS.PROVIDER_FULL_DESCRIPTION.BLOCK',
      Unblock = 'NOTIFICATION_DETAILS.PROVIDER_FULL_DESCRIPTION.UNBLOCK'
    }

    export enum Workshop {
      Open = 'NOTIFICATION_DETAILS.WORKSHOP_FULL_DESCRIPTION.OPEN',
      Closed = 'NOTIFICATION_DETAILS.WORKSHOP_FULL_DESCRIPTION.CLOSED',
      Delete = 'NOTIFICATION_DETAILS.WORKSHOP_FULL_DESCRIPTION.DELETED'
    }

    export enum Parent {
      ProviderBlock = 'NOTIFICATION_DETAILS.PARENT_FULL_DESCRIPTION.BLOCKED_BY_PROVIDER',
      ProviderUnblock = 'NOTIFICATION_DETAILS.PARENT_FULL_DESCRIPTION.UNBLOCKED_BY_PROVIDER'
    }
  }

  export function get(
    descriptionType: NotificationDescriptionType,
    type: NotificationType | NotificationDataType,
    action: NotificationAction | string
  ): string | null {
    return exists(descriptionType, type, action) ? NotificationDescriptions[descriptionType][type][action] : null;
  }

  function exists(
    descriptionType: NotificationDescriptionType,
    type: NotificationType | NotificationDataType,
    action: NotificationAction | string
  ): boolean {
    return (
      descriptionType in NotificationDescriptions &&
      type in NotificationDescriptions[descriptionType] &&
      action in NotificationDescriptions[descriptionType][type]
    );
  }
}
