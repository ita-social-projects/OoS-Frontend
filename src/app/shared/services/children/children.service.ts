import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Child } from '../../models/child.model';
import { SocialGroup } from '../../models/socialGroup.model';
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
    return this.http.get<Child[]>('/Child/Get');
  }

  /**
  * This method get children by Child id
  * @param id
  */
  getChildrenById(id: number): Observable<Child> {
    const dataUrl = `/Child/GetById/${id}`;
    return this.http.get<Child>(dataUrl);
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
    return this.http.delete(`/Child/Delete/${id}`);
  }

  /**
  * This method get all social groups
  */
  getSocialGroup(): Observable<SocialGroup[]> {
    return this.http.get<SocialGroup[]>('/SocialGroup/Get');
  }

  /**
 * This method get all social groups by Id
 */
  getSocialGroupById(id: number): Observable<SocialGroup> {
    return this.http.get<SocialGroup>(`/SocialGroup/GetById/${id}`);
  }
}
