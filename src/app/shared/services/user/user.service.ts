import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  
  private readonly url = '/api/v1/users/personalinfo';

  constructor(private http: HttpClient) {}

  /**
   * This method get user personal information
   */
  getPersonalInfo(): Observable<User> {
    return this.http.get<User>(this.url);
  }

  /**
   * This method update user personal information
   */
  updatePersonalInfo(user: User): Observable<User> {
    return this.http.put<User>(this.url, user);
  }
}
