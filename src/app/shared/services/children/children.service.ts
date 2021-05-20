import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Child } from '../../models/child.model';

const dataUrl = '/assets/mock-child-cards.json';

@Injectable({
  providedIn: 'root'
})

export class ChildrenService {

  constructor(private http: HttpClient) { }

  /**
  * This method get children by User id
  * @param id
  */
  getChildrenById(id: number): Observable<Child[]> {
    const dataUrl = `/Child/GetById/${id}`;
    return this.http.get<Child[]>(`/Child/GetById/${id}`);
  }

  /**
  * This method create Child
  * @param Workshop
  */
  createChild(child: Child): any {
    return this.http.post('/Child/Create', child);
  }

  /**
  * This method delete child by Child id
  * @param id
  */
  deleteChild(id: number): any {
    const dataUrl = `Child/Delete/${id}`;
    return this.http.delete(dataUrl);
  }
}
