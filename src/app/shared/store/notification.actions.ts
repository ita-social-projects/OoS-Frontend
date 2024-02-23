import { NotificationType } from 'shared/enum/notifications';

import { Notification, NotificationGroupedByType } from '../models/notification.model';

export class ClearNotificationState {
  static readonly type = '[user] clear notification state';
}

export class GetAmountOfNewUsersNotifications {
  static readonly type = '[user] get amount of new users notifications';
}

export class GetAllUsersNotificationsGrouped {
  static readonly type = '[user] get all of users notifications';
}

export class ReadAllUsersNotifications {
  static readonly type = '[user] read all of users notifications';
}

export class OnReadAllUsersNotificationsFail {
  static readonly type = '[user] read all of users notifications fail';
  constructor(public error: Error) {}
}

export class ReadUsersNotificationsByType {
  static readonly type = '[user] read users notifications by type';
  constructor(
    public notificationType: NotificationType,
    public needGetRequest: boolean = false
  ) {}
}

export class OnReadUsersNotificationsByTypeSuccess {
  static readonly type = '[user] read users notifications by type success';
}

export class OnReadUsersNotificationsByTypeFail {
  static readonly type = '[user] read users notifications by type fail';
  constructor(public payload: Error) {}
}

export class ReadUsersNotificationById {
  static readonly type = '[user] read users notifications by id';
  constructor(public payload: Notification) {}
}

export class DeleteUsersNotificationById {
  static readonly type = '[user] delete users notification by id';
  constructor(public notificationId: string) {}
}

export class OnDeleteUsersNotificationByIdSuccess {
  static readonly type = '[user] delete users notification by id success';
}

export class OnDeleteUsersNotificationByIdFail {
  static readonly type = '[user] delete users notification by id fail';
  constructor(public error: Error) {}
}
