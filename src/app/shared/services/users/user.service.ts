import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';

@Injectable({providedIn: 'root'})
export class UserService {
  constructor(private http: HttpClient) {}
  /**
   * gets user data
   *
   * @param id: string
   * returnes object of type User
   */
  getUserById(id): Observable<User>{
   return  this.http.get<User>(`/User/GetUserById/${id}`);
  }
}
