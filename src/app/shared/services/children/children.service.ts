import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Child, ChildrenParameters, RequestParams } from '../../models/child.model';
import { PaginationElement } from '../../models/paginationElement.model';
import { SearchResponse } from '../../models/search.model';
import { DataItem, TruncatedItem } from '../../models/item.model';

@Injectable({
  providedIn: 'root'
})
export class ChildrenService {
  constructor(private http: HttpClient, private store: Store) {}

  private setParams(parameters: ChildrenParameters, isParent?: boolean): HttpParams {
    let params = new HttpParams();

    if (parameters) {
      if (parameters.searchString) {
        params = params.set('SearchString', parameters.searchString);
      }
      if (parameters.tabTitle) {
        if (parameters.tabTitle == 'Батьки') {
          isParent = true;
        }
        if (parameters.tabTitle == 'Діти') {
          isParent = false;
        }
      }

      if (isParent !== undefined) {
        params = params.set('isParent', isParent.toString());
      }
    }

    params = params.set('Size', parameters.size.toString()).set('From', parameters.from.toString());

    return params;
  }

  /**
   * This method get children by Parent Child id
   * @param id: number
   */
  getUsersChildren(params: ChildrenParameters): Observable<SearchResponse<Child[]>> {
    const options = { params: this.setParams(params) };

    return this.http.get<SearchResponse<Child[]>>('/api/v1/Child/GetUsersChildren', options);
  }

  getUsersChildrenByParentId(params: RequestParams): Observable<TruncatedItem[]> {
    return this.http.get<TruncatedItem[]>(`/api/v1/Child/GetChildrenListByParentId/${params.id}/${params.isParent}`);
  }

  /**
   * This method get children by Parent Child id
   * @param id: number
   */
  getAllUsersChildren(): Observable<SearchResponse<Child[]>> {
    let params = new HttpParams().set('Size', '0').set('From', '0');

    return this.http.get<SearchResponse<Child[]>>('/api/v1/Child/GetUsersChildren', { params });
  }

  /**
   * This method get children for Admin
   */
  getChildrenForAdmin(paremeters: ChildrenParameters, isParent?: boolean): Observable<SearchResponse<Child[]>> {
    const options = { params: this.setParams(paremeters, isParent) };

    return this.http.get<SearchResponse<Child[]>>('/api/v1/Child/GetAllForAdmin', options);
  }

  /**
   * This method create Child
   * @param child: Child
   */
  createChild(child: Child): Observable<Child> {
    return this.http.post<Child>('/api/v1/Child/Create', child);
  }

  /**
   * This method update Child
   * @param child: Child
   */
  updateChild(child: Child): Observable<Child> {
    return this.http.put<Child>('/api/v1/Child/Update', child);
  }

  /**
   * This method get Users Child By Id
   * @param id: string
   */
  getUsersChildById(id: string): Observable<Child> {
    return this.http.get<Child>(`/api/v1/Child/GetUsersChildById/${id}`);
  }

  /**
   * This method delete child by Child id
   * @param id: string
   */
  deleteChild(id: string): Observable<void> {
    return this.http.delete<void>(`/api/v1/Child/Delete/${id}`);
  }

  /**
   * This method get all social groups
   */
  getSocialGroup(): Observable<DataItem[]> {
    return this.http.get<DataItem[]>('/api/v1/SocialGroup/Get');
  }
}
