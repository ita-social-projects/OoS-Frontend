import { Observable } from 'rxjs';
import { NotificationType } from 'shared/enum/notifications';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Notification, Notifications, NotificationsAmount, NotificationsGroupedByType } from '../../models/notifications.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  constructor(private http: HttpClient) {}

  /**
   * This method get amount of notifications
   */
  public getAmountOfNewUsersNotifications(): Observable<NotificationsAmount> {
    return this.http.get<NotificationsAmount>('/api/v1/Notification/GetAmountOfNewUsersNotifications');
  }

  /**
   * This method get all notifications
   */
  public getAllUsersNotificationsGrouped(): Observable<Notifications> {
    return this.http.get<Notifications>('/api/v1/Notification/GetAllUsersNotificationsGrouped');
  }

  /**
   * This method read notifications by notifications type
   * @param type: string
   */
  public readUsersNotificationsByType(groupType: NotificationType): Observable<void> {
    return this.http.put<void>(`/api/v1/Notification/ReadUsersNotificationsByType/${groupType}`, {});
  }

  /**
   * This method read notification by notification id
   * @param id: string
   */
  public readUsersNotificationById(notification: Notification): Observable<Notification> {
    return this.http.put<Notification>(`/api/v1/Notification/Read/${notification.id}`, notification);
  }

  /**
   * This method get all notifications
   */
  public getAllUsersNotifications(): Observable<Notifications> {
    return this.http.get<Notifications>('/api/v1/Notification/GetAllUsersNotifications');
  }

  /**
   * This method delete notification by id
   */
  public deleteNotification(notificationId: string): Observable<void> {
    return this.http.delete<void>(`/api/v1/Notification/Delete/${notificationId}`);
  }
}
