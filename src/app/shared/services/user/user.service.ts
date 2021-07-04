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
    return this.http.get<User>(`/User/GetUserById/${id}`);
  }

  /**
  * This method update Provider
  * @param Provider
  */
  updateUser(user: User): Observable<Object> {
  return this.http.put('/User/Update', user);
  }
}
