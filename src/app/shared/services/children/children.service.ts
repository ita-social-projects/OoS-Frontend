import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Child } from '../../models/child.model';
@Injectable({
  providedIn: 'root'
})

export class ChildrenService {

  dataUrlmock = '/assets/mock-child-cards.json';

  constructor(private http: HttpClient) { }

  /**
  * This method get all children by User id
  * @param id
  */
  getChildren(): Observable<Child[]> {
    return this.http.get<Child[]>(this.dataUrlmock);
  }

  /**
  * This method get children by Child id
  * @param id
  */
  getChildrenById(id: number): Observable<Child[]> {
    const dataUrl = `/Child/GetById/${id}`;
    return this.http.get<Child[]>(dataUrl);
  }


  /**
  * This method create Child
  * @param Workshop
  */
  createChild(child: Child): Observable<Object> {
    return this.http.post('/Child/Create', child);
  }

  /**
  * This method delete child by Child id
  * @param id
  */
  deleteChild(id: number): Observable<Object> {
    const dataUrl = `Child/Delete/${id}`;
    return this.http.delete(dataUrl);
  }
}
