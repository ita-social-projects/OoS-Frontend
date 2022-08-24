import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { PersonalInfoRole } from '../../enum/role';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}

  /**
   * This method get Personal Info according to teh user role
   * @param userRole: PersonalInfoRole
   * @return user: User
   */
  getPersonalInfo(userRole: PersonalInfoRole): Observable<User> {
    return this.http.get<User>(`/api/v1/${userRole}/GetPersonalInfo`);
  }

  /**
   * This method update Personal Info according to teh user role
   * @param userRole: PersonalInfoRole
   * @param user: User
   * @return user: User
   */
  updatePersonalInfo(userRole: PersonalInfoRole, user: User): Observable<User> {
    return this.http.put<User>(`/api/v1/${userRole}/UpdatePersonalInfo`, user);
  }
}
