export interface NotificationsAmount {
  amount: number;
}
export interface Notification {
  id: string;
  userId: string;
  data: NotificationsDate;
  type: string;
  action: string;
  createdDateTime: string;
  readDateTime: string;
  objectId: string;
}

export interface NotificationGrouped {
  action: string;
  amount: number;
  groupedData: string;
  type: string;
}

export interface Notifications {
  notificationsGrouped: NotificationGrouped[];
  notifications: Notification[];
}

export interface NotificationsDate {
  Status: string;
  Title: string;
}
