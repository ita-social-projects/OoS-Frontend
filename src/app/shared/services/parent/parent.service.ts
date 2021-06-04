import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Parent } from '../../models/parent.model';

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
  createParent(parent: Parent): any {
    return this.http.post('/Parent/Create', parent);
  }

  /**
  * This method delete Parent by id
  * @param id
  */
  deleteParent(id: number): any {
    return this.http.delete(`Parent/Delete/${id}`);
  }

  /**
  * This method get Parent by User id
  */
  getProfile(): Observable<Parent> {
    return this.http.get<Parent>(`/Parent/GetProfile`);
  }
}
