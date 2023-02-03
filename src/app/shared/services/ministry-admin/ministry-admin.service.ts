import { MinistryAdmin, MinistryAdminParameters } from './../../models/ministryAdmin.model';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchResponse } from '../../models/search.model';

@Injectable({
  providedIn: 'root'
})
export class MinistryAdminService {
  constructor(private http: HttpClient) {}

  private setParams(parameters: MinistryAdminParameters = { searchString: '' }): HttpParams {
    let params = new HttpParams();

    if (parameters.searchString) {
      params = params.set('SearchString', parameters.searchString);
    }

    params = params.set('Size', parameters.size.toString()).set('From', parameters.from.toString());

    return params;
  }

  /**
   * This method get Profile of authorized MinistryAdmin
   */
  getMinistryAdminProfile(): Observable<MinistryAdmin> {
    return this.http.get<MinistryAdmin>('/api/v1/MinistryAdmin/Profile');
  }

  /**
   * This method get Ministry Admin by Id
   * * @param ministryAdminId: string
   */
  getMinistryAdminById(ministryAdminId: string): Observable<MinistryAdmin> {
    let params = new HttpParams().set('id', `${ministryAdminId}`);

    return this.http.get<MinistryAdmin>('/api/v1/MinistryAdmin/GetById', { params });
  }

  /**
   * This method get All Ministry Admins
   */
  getAllMinistryAdmin(parameters: MinistryAdminParameters): Observable<SearchResponse<MinistryAdmin[]>> {
    const options = { params: this.setParams(parameters) };

    return this.http.get<SearchResponse<MinistryAdmin[]>>('/api/v1/MinistryAdmin/GetByFilter', options);
  }

  /**
   * This method create Ministry Admin
   * @param ministryAdmin: MinistryAdmin
   */
  createMinistryAdmin(ministryAdmin: MinistryAdmin): Observable<MinistryAdmin> {
    return this.http.post<MinistryAdmin>('/api/v1/MinistryAdmin/Create', ministryAdmin);
  }

  /**
   * This method delete Ministry Admin by id
   * @param ministryAdminId: string
   */
  deleteMinistryAdmin(ministryAdminId: string): Observable<void> {
    let params = new HttpParams().set('ministryAdminId', `${ministryAdminId}`);

    return this.http.delete<void>('/api/v1/MinistryAdmin/Delete', { params });
  }

  /**
   * This method block Ministry Admin
   * @param ministryAdminId: string
   */
  blockMinistryAdmin(ministryAdminId: string, isBlocked: boolean): Observable<void> {
    let params = new HttpParams().set('ministryAdminId', `${ministryAdminId}`).set('isBlocked', `${isBlocked}`);

    return this.http.put<void>('/api/v1/MinistryAdmin/Block', {}, { params });
  }

  /**
   * This method update Ministry Admin
   * @param ministryAdmin: MinistryAdmin
   */
  updateMinistryAdmin(ministryAdmin: MinistryAdmin): Observable<MinistryAdmin> {
    return this.http.put<MinistryAdmin>('/api/v1/MinistryAdmin/Update', ministryAdmin);
  }
}
