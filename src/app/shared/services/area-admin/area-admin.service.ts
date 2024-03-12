import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AdminRoles } from 'shared/enum/admins';
import { AreaAdmin, AreaAdminParameters } from 'shared/models/area-admin.model';
import { SearchResponse } from 'shared/models/search.model';
import { BaseAdminService } from '../base-admin/base-admin.service';

@Injectable({
  providedIn: 'root'
})
export class AreaAdminService extends BaseAdminService {
  constructor(protected http: HttpClient) {
    super(http, AdminRoles.areaAdmin);
  }

  /**
   * This method get All Area Admins
   */
  public getAllAdmin(parameters: AreaAdminParameters): Observable<SearchResponse<AreaAdmin[]>> {
    return super.getAllAdmin(parameters) as Observable<SearchResponse<AreaAdmin[]>>;
  }

  /**
   * This method get Area Admin by Id
   * @param AreaAdminId string
   */
  public getAdminById(AreaAdminId: string): Observable<AreaAdmin> {
    return super.getAdminById(AreaAdminId) as Observable<AreaAdmin>;
  }

  /**
   * This method get Profile of authorized Area Admin
   */
  public getAdminProfile(): Observable<AreaAdmin> {
    return super.getAdminProfile() as Observable<AreaAdmin>;
  }

  /**
   * This method create AreaAdmin
   * @param areaAdmin
   */
  public createAdmin(areaAdmin: AreaAdmin): Observable<AreaAdmin> {
    return super.createAdmin(areaAdmin) as Observable<AreaAdmin>;
  }

  /**
   * This method update Area Admin
   * @param areaAdmin
   */
  public updateAdmin(areaAdmin: AreaAdmin): Observable<AreaAdmin> {
    return super.updateAdmin(areaAdmin) as Observable<AreaAdmin>;
  }

  /**
   * This method delete Area Admin by id
   * @param areaAdminId
   */
  public deleteAdmin(areaAdminId: string): Observable<void> {
    return super.deleteAdmin(areaAdminId);
  }

  /**
   * This method block Area Admin
   * @param AreaAdminId
   * @param isBlocked
   */
  public blockAdmin(AreaAdminId: string, isBlocked: boolean): Observable<void> {
    return super.blockAdmin(AreaAdminId, isBlocked);
  }

  /**
   * This method reinvite Area Admin
   * @param areaAdminId: string
   */
  public reinviteAdmin(areaAdminId: string): Observable<void> {
    return super.reinviteAdmin(areaAdminId);
  }
}
