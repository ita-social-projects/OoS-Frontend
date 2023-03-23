import { Observable } from "rxjs";

import { HttpClient, HttpParams } from "@angular/common/http";

import { BaseAdminParameters, BaseAdmin } from "../../models/admin.model";
import { PaginationConstants } from "../../constants/constants";
import { SearchResponse } from "../../models/search.model";
import { AdminIds, AdminRoles } from "../../enum/admins";

export class BaseAdminService {
  protected adminType = "";
  constructor(protected http: HttpClient, adminType: AdminRoles) {
    this.adminType = adminType;
  }

  protected get adminBaseUrl(): string {
    return `/api/v1/${this.adminType}`;
  }

  protected setParams(parameters: BaseAdminParameters = { searchString: '' }): HttpParams {
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
   * This method get Profile of authorized Admin
   */
  protected getAdminProfile(): Observable<BaseAdmin> {
    return this.http.get<BaseAdmin>(`${this.adminBaseUrl}/Profile`);
  }

  /**
   * This method get Admin by Id
   * * @param adminId: string
   */
  protected getAdminById(adminId: string): Observable<BaseAdmin> {
    let params = new HttpParams().set('id', `${adminId}`);

    return this.http.get<BaseAdmin>(`${this.adminBaseUrl}/GetById`, { params });
  }

  /**
   * This method get All Admins
   */
  protected getAllAdmin(parameters: BaseAdminParameters): Observable<SearchResponse<BaseAdmin[]>> {
    const options = { params: this.setParams(parameters) };

    return this.http.get<SearchResponse<BaseAdmin[]>>(`${this.adminBaseUrl}/GetByFilter`, options);
  }

  /**
   * This method create Admin
   * @param baseAdmin: BaseAdmin
   */
  protected createAdmin(baseAdmin: BaseAdmin): Observable<BaseAdmin> {
    return this.http.post<BaseAdmin>(`${this.adminBaseUrl}/Create`, baseAdmin);
  }

  /**
   * This method delete Admin by id
   * @param adminId: string
   */
  protected deleteAdmin(adminId: string): Observable<void> {
    let params = new HttpParams().set(AdminIds[this.adminType], `${adminId}`);

    return this.http.delete<void>(`${this.adminBaseUrl}/Delete`, { params });
  }

  /**
   * This method block Admin
   * @param adminId: string
   */
  protected blockAdmin(adminId: string, isBlocked: boolean): Observable<void> {
    let params = new HttpParams().set(AdminIds[this.adminType], `${adminId}`).set('isBlocked', `${isBlocked}`);

    return this.http.put<void>(`${this.adminBaseUrl}/Block`, {}, { params });
  }

  /**
   * This method update Admin
   * @param baseAdmin: BaseAdmin
   */
  protected updateAdmin(admin: BaseAdmin): Observable<BaseAdmin> {
    return this.http.put<BaseAdmin>(`${this.adminBaseUrl}/Update`, admin);
  }
}
