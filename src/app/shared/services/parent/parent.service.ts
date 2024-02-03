import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ParentBlockedData, Parent } from '../../models/parent.model';

@Injectable({
  providedIn: 'root'
})
export class ParentService {
  constructor(private http: HttpClient) {}

  /**
   * This method get Parent by User id
   */
  public getProfile(): Observable<Parent> {
    return this.http.get<Parent>('/api/v1/parents/profile');
  }

  public blockUnblockParent(parentBlockedData: ParentBlockedData): Observable<null> {
    return this.http.post<null>('/api/v1/parents/BlockUnblockParent', parentBlockedData);
  }
}
