export interface NotificationsAmount {
  amount: number;
}
export interface Notification {
  id?: string;
  userId: string;
  data?: NotificationsDate;
  type: string;
  action: string;
  createdDateTime: string;
  readDateTime?: string;
  objectId?: string;
}

export class NotificationGroupedByAdditionalData {
  action: string;
  amount: number;
  groupedData: string;
  type: string;

  constructor(action: string, groupedData: string, type: string) {
    this.action = action;
    this.amount = 1;
    this.groupedData = groupedData;
    this.type = type;
  }
}

export interface Notifications {
  notificationsGrouped: NotificationGroupedByAdditionalData[];
  notifications: Notification[];
}

export interface NotificationsDate {
  Status?: string;
  Title?: string;
}

export class NotificationsGroupedByType {
  type: string;
  amount: number;
  isRead: boolean;
  groupsByAdditionalData: NotificationGroupedByAdditionalData[];

  constructor(type: string, amount: number, groupsByAction: NotificationGroupedByAdditionalData[]) {
    this.type = type;
    this.amount = amount;
    this.isRead = false;
    this.groupsByAdditionalData = groupsByAction;
  }
}
