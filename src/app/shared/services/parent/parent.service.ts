import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Parent } from '../../models/parent.model';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ParentService {

  constructor(private http: HttpClient) { }

  /**
   * This method get Parent by User id
   */
  getProfile(): Observable<Parent> {
    return this.http.get<Parent>(`/Parent/GetProfile`);
  }
}
