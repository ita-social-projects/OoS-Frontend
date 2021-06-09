import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Parent } from '../../models/parent.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParentService {

  constructor(private http: HttpClient) { }

  /**
    * This method get Parent by id
    * @param id
    */
  getParentById(id: number): Observable<Parent> {
    return this.http.get<Parent>(`/Parent/Get`);
  }

  /**
  * This method create Parent
  * @param Parent
  */
  createParent(parent: Parent): Observable<Object> {
    return this.http.post('/Parent/Create', parent);
  }

  /**
  * This method update Parent
  * @param Parent
  */
  updateParent(parent: Parent): Observable<Object> {
    return this.http.put('/Parent/Update', parent);
  }

  /**
  * This method delete Parent by id
  * @param id
  */
  deleteParent(id: number): Observable<Object> {
    return this.http.delete(`Parent/Delete/${id}`);
  }

  /**
  * This method get Parent by User id
  */
  getProfile(): Observable<Parent> {
    return this.http.get<Parent>(`/Parent/GetProfile`);
  }
}
