import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { Child, ChildrenParameters, RequestParams } from '../../models/child.model';
import { DataItem, TruncatedItem } from '../../models/item.model';
import { SearchResponse } from '../../models/search.model';

@Injectable({
  providedIn: 'root'
})
export class ChildrenService {
  constructor(
    private http: HttpClient,
    private store: Store
  ) {}

  /**
   * This method get Parent children
   */
  public getAllUsersChildren(): Observable<SearchResponse<Child[]>> {
    const params = new HttpParams().set('Size', '0').set('From', '0');

    return this.http.get<SearchResponse<Child[]>>('/api/v1/children/my', { params });
  }

  /**
   * This method get Parent children by params
   */
  public getUsersChildren(parameters: ChildrenParameters): Observable<SearchResponse<Child[]>> {
    const params = this.setParams(parameters);

    return this.http.get<SearchResponse<Child[]>>('/api/v1/children/my', { params });
  }

  public getUsersChildrenByParentId(parameters: RequestParams): Observable<TruncatedItem[]> {
    const params = new HttpParams().set('isParent', `${parameters.isParent}`);

    return this.http.get<TruncatedItem[]>(`/api/v1/parents/${parameters.id}/children`, { params });
  }

  /**
   * This method get children for Admin
   */
  public getChildrenForAdmin(parameters: ChildrenParameters): Observable<SearchResponse<Child[]>> {
    const params = { params: this.setParams(parameters) };

    return this.http.get<SearchResponse<Child[]>>('/api/v1/children', params);
  }

  /**
   * This method get Users Child By Id
   */
  public getUsersChildById(id: string): Observable<Child> {
    return this.http.get<Child>(`/api/v1/children/my/${id}`);
  }

  /**
   * This method create single Child
   */
  public createChild(child: Child): Observable<Child> {
    return this.http.post<Child>('/api/v1/children', child);
  }

  /**
   * This method create array of Child
   */
  public createChildren(children: Child[]): Observable<Child[]> {
    return this.http.post<Child[]>('/api/v1/children/batch', children);
  }

  /**
   * This method update Child
   */
  public updateChild(child: Child): Observable<Child> {
    return this.http.put<Child>(`/api/v1/children/${child.id}`, child);
  }

  /**
   * This method delete child by Child id
   */
  public deleteChild(id: string): Observable<void> {
    return this.http.delete<void>(`/api/v1/children/${id}`);
  }

  /**
   * This method get all social groups
   */
  public getSocialGroup(localization?: number): Observable<DataItem[]> {
    let params = new HttpParams();

    if (localization) {
      params = params.set('localization', localization);
    }

    return this.http.get<DataItem[]>('/api/v1/SocialGroup/Get', { params });
  }

  private setParams(parameters: ChildrenParameters): HttpParams {
    let params = new HttpParams();

    if (parameters) {
      if (parameters.searchString) {
        params = params.set('SearchString', parameters.searchString);
      }

      if (typeof parameters.isParent === 'boolean') {
        params = params.set('isParent', parameters.isParent);
      }

      if (typeof parameters.isGetParent === 'boolean') {
        params = params.set('isGetParent', parameters.isGetParent);
      }

      params = params.set('Size', parameters.size.toString()).set('From', parameters.from.toString());
    }

    return params;
  }
}
