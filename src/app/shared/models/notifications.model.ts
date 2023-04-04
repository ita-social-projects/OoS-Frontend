import { NotificationType } from 'shared/enum/notifications';

export interface NotificationsAmount {
  amount: number;
}
export interface Notification {
  id?: string;
  userId: string;
  data?: NotificationsDate;
  type: NotificationType;
  action: string;
  createdDateTime: string;
  readDateTime?: string;
  objectId?: string;
}

export class NotificationGroupedByAdditionalData {
  action: string;
  amount = 1;
  groupedData: string;
  type: NotificationType;

  constructor(action: string, groupedData: string, type: NotificationType) {
    this.action = action;
    this.groupedData = groupedData;
    this.type = type;
  }
}

export interface Notifications {
  notificationsGroupedByType: NotificationsGroupedByType[];
  notifications: Notification[];
}

export interface NotificationsDate {
  Status?: string;
  Title?: string;
}

export class NotificationsGroupedByType {
  type: NotificationType;
  amount: number;
  isRead?: boolean = false;
  groupedByAdditionalData: NotificationGroupedByAdditionalData[];

  constructor(type: NotificationType, amount: number, groupsByAction: NotificationGroupedByAdditionalData[]) {
    this.type = type;
    this.amount = amount;
    this.groupedByAdditionalData = groupsByAction;
  }
}
