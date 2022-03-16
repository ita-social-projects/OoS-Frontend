export interface NotificationsAmount {
  amount: number;
}
export interface Notification {
  id: string;
  userId: string;
  text: string;
  type: string;
  action: string;
  createdDateTime: string;
  readDateTime: string;
  objectId: string;
}

export interface NotificationGrouped {
  type: string;
  amount: number;
}

export interface Notifications {
  notificationsGrouped: NotificationGrouped[];
  notifications: Notification[];
}
