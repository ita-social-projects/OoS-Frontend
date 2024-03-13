import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { PaginationConstants } from 'shared/constants/constants';
import { AdminIds, AdminRoles } from 'shared/enum/admins';
import { BaseAdmin, BaseAdminParameters } from 'shared/models/admin.model';
import { SearchResponse } from 'shared/models/search.model';

export abstract class BaseAdminService {
  protected adminType = '';

  protected constructor(
    protected http: HttpClient,
    adminType: AdminRoles
  ) {
    this.adminType = adminType;
  }

  protected get baseApiUrl(): string {
    return `/api/v1/${this.adminType}`;
  }

  /**
   * This method get Profile of authorized Admin
   */
  protected getAdminProfile(): Observable<BaseAdmin> {
    return this.http.get<BaseAdmin>(`${this.baseApiUrl}/Profile`);
  }

  /**
   * This method get Admin by Id
   * @param adminId string
   */
  protected getAdminById(adminId: string): Observable<BaseAdmin> {
    const params = new HttpParams().set('id', `${adminId}`);

    return this.http.get<BaseAdmin>(`${this.baseApiUrl}/GetById`, { params });
  }

  /**
   * This method get All Admins
   */
  protected getAllAdmin(parameters: BaseAdminParameters): Observable<SearchResponse<BaseAdmin[]>> {
    const options = { params: this.setParams(parameters) };

    return this.http.get<SearchResponse<BaseAdmin[]>>(`${this.baseApiUrl}/GetByFilter`, options);
  }

  /**
   * This method create Admin
   * @param baseAdmin BaseAdmin
   */
  protected createAdmin(baseAdmin: BaseAdmin): Observable<BaseAdmin> {
    return this.http.post<BaseAdmin>(`${this.baseApiUrl}/Create`, baseAdmin);
  }

  /**
   * This method delete Admin by id
   * @param adminId string
   */
  protected deleteAdmin(adminId: string): Observable<void> {
    const params = new HttpParams().set(AdminIds[this.adminType], `${adminId}`);

    return this.http.delete<void>(`${this.baseApiUrl}/Delete`, { params });
  }

  /**
   * This method block Admin
   * @param adminId string
   * @param isBlocked boolean
   */
  protected blockAdmin(adminId: string, isBlocked: boolean): Observable<void> {
    const params = new HttpParams().set(AdminIds[this.adminType], `${adminId}`).set('isBlocked', `${isBlocked}`);

    return this.http.put<void>(`${this.baseApiUrl}/Block`, {}, { params });
  }

  /**
   * This method update Admin
   * @param admin BaseAdmin
   */
  protected updateAdmin(admin: BaseAdmin): Observable<BaseAdmin> {
    return this.http.put<BaseAdmin>(`${this.baseApiUrl}/Update`, admin);
  }

  /**
   * This method reinvite Admin
   * @param adminId: string
   */
  protected reinviteAdmin(adminId: string): Observable<void> {
    return this.http.put<void>(`${this.baseApiUrl}/Reinvite/${adminId}`, {});
  }

  protected setParams(parameters: BaseAdminParameters = { searchString: '' }): HttpParams {
    let params = new HttpParams();

    if (parameters.searchString) {
      params = params.set('SearchString', parameters.searchString);
    }

    const size = parameters?.size?.toString() || PaginationConstants.TABLE_ITEMS_PER_PAGE;
    const from = parameters?.from?.toString() || '0';

    params = params.set('Size', size).set('From', from);

    return params;
  }
}
