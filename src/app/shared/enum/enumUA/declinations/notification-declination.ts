import { NotificationType } from 'shared/enum/notifications';

export namespace NotificationDeclination {
  export type DeclinationType = Chat.NotificationDeclinationType | Application.NotificationDeclinationType;

  export namespace Chat {
    export type NotificationDeclinationType = typeof Changes | typeof Unread;

    export enum Changes {
      'ENUM.CHAT_CHANGES.CHANGE_IN_MESSAGES',
      'ENUM.CHAT_CHANGES.CHANGES_IN_MESSAGES',
      'ENUM.CHAT_CHANGES.CHANGE_IN_MESSAGES_ABLATIVE'
    }

    export enum Unread {
      'ENUM.CHAT_UNREAD.UNREAD_MESSAGE',
      'ENUM.CHAT_UNREAD.UNREAD_MESSAGES',
      'ENUM.CHAT_UNREAD.UNREAD_MESSAGE_ABLATIVE'
    }
  }

  export namespace Application {
    export type NotificationDeclinationType =
      | typeof Changes
      | typeof Approved
      | typeof AcceptedForSelection
      | typeof Pending
      | typeof Rejected
      | typeof Left;

    export enum Changes {
      'ENUM.APPLICATION_CHANGES.CHANGE_IN_APPLICATIONS',
      'ENUM.APPLICATION_CHANGES.CHANGES_IN_APPLICATIONS',
      'ENUM.APPLICATION_CHANGES.CHANGE_IN_APPLICATIONS_ABLATIVE'
    }

    export enum AcceptedForSelection {
      'ENUM.APPLICATION_ACCEPTED_FOR_SELECTION.APPLICATION_ACCEPTED_FOR_SELECTION',
      'ENUM.APPLICATION_ACCEPTED_FOR_SELECTION.APPLICATIONS_ACCEPTED_FOR_SELECTION',
      'ENUM.APPLICATION_ACCEPTED_FOR_SELECTION.APPLICATION_ACCEPTED_FOR_SELECTION_ABLATIVE'
    }

    export enum Approved {
      'ENUM.APPLICATION_APPROVED.APPLICATION_APPROVED',
      'ENUM.APPLICATION_APPROVED.APPLICATIONS_APPROVED',
      'ENUM.APPLICATION_APPROVED.APPLICATION_APPROVED_ABLATIVE'
    }

    export enum Pending {
      'ENUM.APPLICATION_PENDING.APPLICATION_PENDING_CONFIRMATION',
      'ENUM.APPLICATION_PENDING.APPLICATIONS_PENDING_CONFIRMATION',
      'ENUM.APPLICATION_PENDING.APPLICATION_PENDING_CONFIRMATION_ABLATIVE'
    }

    export enum Rejected {
      'ENUM.APPLICATION_REJECTED.APPLICATION_REJECTED',
      'ENUM.APPLICATION_REJECTED.APPLICATIONS_REJECTED',
      'ENUM.APPLICATION_REJECTED.APPLICATION_REJECTED_ABLATIVE'
    }

    export enum Left {
      'ENUM.APPLICATION_LEFT.WORKSHOP_LEFT',
      'ENUM.APPLICATION_LEFT.WORKSHOPS_LEFT',
      'ENUM.APPLICATION_LEFT.WORKSHOP_LEFT_ABLATIVE'
    }
  }

  export function getDeclination(notificationType: NotificationType, status: string): DeclinationType {
    return declinationExists(notificationType, status) ? NotificationDeclination[notificationType][status] : null;
  }

  export function declinationExists(notificationType: NotificationType, status: string): boolean {
    return notificationType in NotificationDeclination && status in NotificationDeclination[notificationType];
  }
}
