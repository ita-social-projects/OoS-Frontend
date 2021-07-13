import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Child } from '../../models/child.model';
import { SocialGroup } from '../../models/socialGroup.model';
@Injectable({
  providedIn: 'root'
})

export class ChildrenService {

  constructor(private http: HttpClient) { }

  /**
  * This method get children by Child id
  * @param id
  */
  getChildById(id: number): Observable<Child> {
    const dataUrl = `/Child/GetById/${id}`;
    return this.http.get<Child>(dataUrl);
  }

  /**
  * This method get children by Parent Child id
  * @param id
  */
  getChildrenByParentId(id: number): Observable<Child[]> {
    return this.http.get<Child[]>(`/Child/GetByParentId/${id}`);
  }


  /**
  * This method create Child
  * @param Child
  */
  createChild(child: Child): Observable<Object> {
    return this.http.post('/Child/Create', child);
  }

  /**
  * This method update Child
  * @param Child
  */
  updateChild(child: Child): Observable<Object> {
    return this.http.put('/Child/Update', child);
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
