import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Parent, ParentBlockedData, ParentPayload } from 'shared/models/parent.model';

@Injectable({
  providedIn: 'root'
})
export class ParentService {
  private readonly baseApiUrl = '/api/v1/parents';

  constructor(private http: HttpClient) {}

  /**
   * This method get Parent by User id
   */
  public getProfile(): Observable<Parent> {
    return this.http.get<Parent>(`${this.baseApiUrl}/profile`);
  }

  public blockUnblockParent(parentBlockedData: ParentBlockedData): Observable<void> {
    return this.http.post<void>(`${this.baseApiUrl}/BlockUnblockParent`, parentBlockedData);
  }

  public createParent(parentPayload: ParentPayload): Observable<Parent> {
    return this.http.post<Parent>(`${this.baseApiUrl}`, parentPayload);
  }
}
