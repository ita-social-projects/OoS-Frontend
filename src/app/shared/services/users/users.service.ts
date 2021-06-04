import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';

@Injectable({ providedIn: 'root' })
export class UsersService {

  constructor(private http: HttpClient) { }

  /**
   * gets user data
   * @return object of type User
   */
  getUserById(id): Observable<User> {
    return this.http.get<User>(`/User/GetUserById/${id}`);
  }

  /**
   * THis method update user registration status
   */
  registerUser(id): Observable<User> {
    return this.http.put<User>(`/User/Update`, {
      id: id,
      isRegistered: true
    }
    );
  }
}
