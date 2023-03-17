import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchResponse } from '../../models/search.model';
import { RegionAdmin, RegionAdminParameters } from '../../models/regionAdmin.model';
import { PaginationConstants } from '../../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class RegionAdminService {
  constructor(private http: HttpClient) { }

  private setParams(parameters: RegionAdminParameters = { searchString: '' }): HttpParams {
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
   * This method get Profile of authorized RegionAdmin
   */
  getRegionAdminProfile(): Observable<RegionAdmin> {
    return this.http.get<RegionAdmin>('/api/v1/RegionAdmin/Profile');
  }

  /**
   * This method get Region Admin by Id
   * * @param regionAdminId: string
   */
  getRegionAdminById(regionAdminId: string): Observable<RegionAdmin> {
    let params = new HttpParams().set('id', `${regionAdminId}`);

    return this.http.get<RegionAdmin>('/api/v1/RegionAdmin/GetById', { params });
  }

  /**
   * This method get All Region Admins
   */
  getAllRegionAdmin(parameters: RegionAdminParameters): Observable<SearchResponse<RegionAdmin[]>> {
    const options = { params: this.setParams(parameters) };

    return this.http.get<SearchResponse<RegionAdmin[]>>('/api/v1/RegionAdmin/GetByFilter', options);
  }

  /**
   * This method create Region Admin
   * @param RegionAdmin: RegionAdmin
   */
  createRegionAdmin(RegionAdmin: RegionAdmin): Observable<RegionAdmin> {
    return this.http.post<RegionAdmin>('/api/v1/RegionAdmin/Create', RegionAdmin);
  }

  /**
   * This method delete Region Admin by id
   * @param RegionAdminId: string
   */
  deleteRegionAdmin(RegionAdminId: string): Observable<void> {
    let params = new HttpParams().set('RegionAdminId', `${RegionAdminId}`);

    return this.http.delete<void>('/api/v1/RegionAdmin/Delete', { params });
  }

  /**
   * This method block Region Admin
   * @param RegionAdminId: string
   */
  blockRegionAdmin(RegionAdminId: string, isBlocked: boolean): Observable<void> {
    let params = new HttpParams().set('RegionAdminId', `${RegionAdminId}`).set('isBlocked', `${isBlocked}`);

    return this.http.put<void>('/api/v1/RegionAdmin/Block', {}, { params });
  }

  /**
   * This method update Region Admin
   * @param RegionAdmin: RegionAdmin
   */
  updateRegionAdmin(RegionAdmin: RegionAdmin): Observable<RegionAdmin> {
    return this.http.put<RegionAdmin>('/api/v1/RegionAdmin/Update', RegionAdmin);
  }
}
