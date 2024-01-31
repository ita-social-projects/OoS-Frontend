import { NotificationAction, NotificationDataType, NotificationType } from 'shared/enum/notifications';

export interface NotificationAmount {
  amount: number;
}

export interface Notification {
  id?: string;
  userId: string;
  data: { [key in NotificationDataType]: string };
  type: NotificationType;
  action: NotificationAction;
  createdDateTime: Date;
  readDateTime?: Date;
  objectId?: string;
}

export class NotificationGrouped {
  type: NotificationType;
  action?: NotificationAction;
  groupedData?: string;
  amount: number = 1;

  constructor(type: NotificationType, action?: NotificationAction, groupedData?: string) {
    this.type = type;

    if (action) {
      this.action = action;
    }
    if (groupedData) {
      this.groupedData = groupedData;
    }
  }
}

export class NotificationGroupedByType {
  type: NotificationType;
  amount?: number;
  groupedByAdditionalData?: NotificationGrouped[];
  isRead?: boolean;

  constructor(type: NotificationType, amount?: number, groupedByAdditionalData?: NotificationGrouped[]) {
    this.type = type;

    if (amount) {
      this.amount = amount;
    }
    if (groupedByAdditionalData) {
      this.groupedByAdditionalData = groupedByAdditionalData;
    }
  }
}

export interface NotificationGroupedAndSingle {
  notificationsGroupedByType?: NotificationGroupedByType[];
  notifications?: Notification[];
}
