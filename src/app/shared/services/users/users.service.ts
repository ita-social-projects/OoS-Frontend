import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';

@Injectable({providedIn: 'root'})
export class UsersService {
  constructor(private http: HttpClient) {}

  getUserById(id): Observable<User>{
   return  this.http.get<User>(`/User/GetUserById/${id}`);
  }
}
