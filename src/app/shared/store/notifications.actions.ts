import { Notification, NotificationGrouped, NotificationsGroupedByType } from '../models/notifications.model';

export class GetAmountOfNewUsersNotifications {
  static readonly type = '[user] get amount of new users notifications';
  constructor() {}
}

export class GetAllUsersNotificationsGrouped {
  static readonly type = '[user] get all of users notifications';
  constructor() {}
}

export class ReadUsersNotificationsByType {
  static readonly type = '[user] read users notifications by type';
  constructor(public payload: NotificationsGroupedByType) {}
}

export class DeleteUsersNotificationById {
  static readonly type = '[user] delete users notification by id';
  constructor(public notificationId: string) {}
}

export class OnDeleteUsersNotificationByIdSuccess {
  static readonly type = '[user] delete users notification by id success';
  constructor() {}
}

export class OnDeleteUsersNotificationByIdFail {
  static readonly type = '[user] delete users notification by id fail';
  constructor(public error: Error) {}
}

export class OnReadUsersNotificationsByTypeSuccess {
  static readonly type = '[user] read users notifications by type success';
  constructor(public payload: NotificationGrouped) {}
}
export class ReadUsersNotificationById {
  static readonly type = '[user] read users notifications by id';
  constructor(public payload: Notification) {}
}

export class OnReadUsersNotificationsFail {
  static readonly type = '[user] read users notifications by type fail';
  constructor(public payload: Error) {}
}
