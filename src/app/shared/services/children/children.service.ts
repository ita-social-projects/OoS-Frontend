import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Constants } from '../../constants/constants';
import { Child, ChildCards } from '../../models/child.model';
import { SocialGroup } from '../../models/socialGroup.model';
import { UserStateModel } from '../../store/user.state';
@Injectable({
  providedIn: 'root'
})

export class ChildrenService {

  constructor(private http: HttpClient) { }

  private setParams(state: UserStateModel): HttpParams {
    let params = new HttpParams();

    if (state.currentPage) {
      const size: number = Constants.ITEMS_PER_PAGE;
      const from: number = size * (+state.currentPage.element - 1);

      params = params.set('Size', size.toString());
      params = params.set('From', from.toString());
    }

    return params;
  }

  /**
  * This method get children by Parent Child id
  * @param id
  */
  getUsersChildren(state: UserStateModel): Observable<ChildCards> {
    const options = { params: this.setParams(state) };

    return this.http.get<ChildCards>(`/Child/GetUsersChildren`, options);
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
