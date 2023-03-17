import { MinistryAdmin, MinistryAdminParameters } from './../../models/ministryAdmin.model';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchResponse } from '../../models/search.model';
import { PaginationConstants } from '../../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class MinistryAdminService {
  private readonly adminTypeUrlPart = "";
  constructor(private http: HttpClient) {}

  private setParams(parameters: MinistryAdminParameters = { searchString: '' }): HttpParams {
    let params = new HttpParams();

    if (parameters.searchString) {
      params = params.set('SearchString', parameters.searchString);
    }

    const size = parameters?.size?.toString() || PaginationConstants.TABLE_ITEMS_PER_PAGE;
    const from = parameters?.from?.toString() || "0";

    params = params.set('Size', size).set('From', from);

    return params;
  }

  /**
   * This method get Profile of authorized MinistryAdmin
   */
  getMinistryAdminProfile(): Observable<MinistryAdmin> {
    return this.http.get<MinistryAdmin>(`/api/v1/MinistryAdmin/Profile`);
  }

  /**
   * This method get Ministry Admin by Id
   * * @param adminId: string
   */
  getMinistryAdminById(adminId: string): Observable<MinistryAdmin> {
    let params = new HttpParams().set('id', `${adminId}`);

    return this.http.get<MinistryAdmin>(`/api/v1/MinistryAdmin/GetById`, { params });
  }

  /**
   * This method get All Ministry Admins
   */
  getAllMinistryAdmin(parameters: MinistryAdminParameters): Observable<SearchResponse<MinistryAdmin[]>> {
    const options = { params: this.setParams(parameters) };

    return this.http.get<SearchResponse<MinistryAdmin[]>>(`/api/v1/MinistryAdmin/GetByFilter`, options);
  }

  /**
   * This method create Ministry Admin
   * @param ministryAdmin: MinistryAdmin
   */
  createMinistryAdmin(ministryAdmin: MinistryAdmin): Observable<MinistryAdmin> {
    return this.http.post<MinistryAdmin>(`/api/v1/MinistryAdmin/Create`, ministryAdmin);
  }

  /**
   * This method delete Ministry Admin by id
   * @param adminId: string
   */
  deleteMinistryAdmin(adminId: string): Observable<void> {
    let params = new HttpParams().set('ministryAdminId', `${adminId}`);

    return this.http.delete<void>(`/api/v1/MinistryAdmin/Delete`, { params });
  }

  /**
   * This method block Ministry Admin
   * @param adminId: string
   */
  blockMinistryAdmin(adminId: string, isBlocked: boolean): Observable<void> {
    let params = new HttpParams().set('ministryAdminId', `${adminId}`).set('isBlocked', `${isBlocked}`);

    return this.http.put<void>(`/api/v1/MinistryAdmin/Block`, {}, { params });
  }

  /**
   * This method update Ministry Admin
   * @param ministryAdmin: MinistryAdmin
   */
  updateMinistryAdmin(ministryAdmin: MinistryAdmin): Observable<MinistryAdmin> {
    return this.http.put<MinistryAdmin>(`/api/v1/MinistryAdmin/Update`, ministryAdmin);
  }
}
