import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IParentBlockedData, Parent } from '../../models/parent.model';
import { Observable } from 'rxjs';

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

  public blockUnblockParent(parentBlockedData: IParentBlockedData): Observable<null> {
    return this.http.post<null>('/api/v1/parents/BlockUnblockParent', parentBlockedData);
  }
}
