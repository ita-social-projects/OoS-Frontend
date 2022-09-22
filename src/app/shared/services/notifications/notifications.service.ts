import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NotificationsAmount, Notifications, NotificationGrouped, Notification } from '../../models/notifications.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(private http: HttpClient) { }

  /**
   * This method get amount of notifications
   */
  getAmountOfNewUsersNotifications(): Observable<NotificationsAmount> {
    return this.http.get<NotificationsAmount>(`/api/v1/Notification/GetAmountOfNewUsersNotifications`);
  }

  /**
   * This method get all notifications
   */
  getAllUsersNotificationsGrouped(): Observable<Notifications> {
    return this.http.get<Notifications>(`/api/v1/Notification/GetAllUsersNotificationsGrouped`);
  }

  /**
   * This method read notifications by notifications type
   * @param type: string
   */
  readUsersNotificationsByType(notificationsGrouped: NotificationGrouped): Observable<any> {
    return this.http.put<any>(`/api/v1/Notification/ReadUsersNotificationsByType/${notificationsGrouped.type}`, notificationsGrouped);
  }

  /**
   * This method read notification by notification id
   * @param id: string
   */
  readUsersNotificationById(notification: Notification): Observable<any> {
    return this.http.put<any>(`/api/v1/Notification/Read/${notification.id}`, notification);
  }

  /**
   * This method get all notifications
   */
  getAllUsersNotifications(): Observable<Notifications> {
    return this.http.get<Notifications>(`/api/v1/Notification/GetAllUsersNotifications`);
  }
}
