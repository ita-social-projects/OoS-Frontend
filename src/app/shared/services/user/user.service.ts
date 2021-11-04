import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {

  constructor(private http: HttpClient) { }

  /**
   * gets user data
   * @return object of type User
   */
  getUserById(id): Observable<User> {
    return this.http.get<User>(`/api/v1/User/GetUserById/${id}`);
  }

  /**
   * This method update Provider
   * @param user: User
   */
  updateUser(user: User): Observable<object> {
    return this.http.put('/api/v1/User/Update', user);
  }
}
