import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NotificationsAmount } from '../../models/notifications.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(private http: HttpClient) { }

  /**
   * This method get workshops by Provider id
   * @param id: string
   */
  getAmountOfNewUsersNotifications(): Observable<any> {
    return this.http.get<any>(`/api/v1/Notification/GetAmountOfNewUsersNotifications`);
  }
}