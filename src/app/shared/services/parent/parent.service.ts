import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Parent } from '../../models/parent.model';
import { Observable, of } from 'rxjs';

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

  public blockUnblockParent(parent: Parent): Observable<boolean> {
    // return this.http.post<boolean>('/api/v1/parents/BlockUnblockParent', {});
    return of(true);  //FIXME: Refactor 
  }
}
