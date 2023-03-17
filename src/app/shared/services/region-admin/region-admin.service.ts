import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AdminRoles } from 'shared/enum/admins';
import { BaseAdminService } from '../base-admin/base-admin';
import { RegionAdmin, RegionAdminParameters } from '../../models/regionAdmin.model';
import { SearchResponse } from '../../models/search.model';

@Injectable({
  providedIn: 'root'
})
export class RegionAdminService extends BaseAdminService {
  constructor(protected http: HttpClient) {
    super(http, AdminRoles.regionAdmin);
  }

  /**
   * This method get Profile of authorized RegionAdmin
   */
  getAdminProfile(): Observable<RegionAdmin> {
    return <Observable<RegionAdmin>>super.getAdminProfile();
  }

  /**
   * This method get Region Admin by Id
   * * @param regionAdminId: string
   */
  getAdminById(regionAdminId: string): Observable<RegionAdmin> {
    return <Observable<RegionAdmin>>super.getAdminById(regionAdminId);
  }

  /**
   * This method get All Region Admins
   */
  getAllAdmin(parameters: RegionAdminParameters): Observable<SearchResponse<RegionAdmin[]>> {
    return <Observable<SearchResponse<RegionAdmin[]>>>super.getAllAdmin(parameters);
  }

  /**
   * This method create Region Admin
   * @param regionAdmin: RegionAdmin
   */
  createAdmin(regionAdmin: RegionAdmin): Observable<RegionAdmin> {
    return <Observable<RegionAdmin>>super.createAdmin(regionAdmin);
  }

  /**
   * This method delete Region Admin by id
   * @param regionAdminId: string
   */
  deleteAdmin(regionAdminId: string): Observable<void> {
    return super.deleteAdmin(regionAdminId);
  }

  /**
   * This method block Region Admin
   * @param regionAdminId: string
   */
  blockAdmin(regionAdminId: string, isBlocked: boolean): Observable<void> {
    return super.blockAdmin(regionAdminId, isBlocked);
  }

  /**
   * This method update Region Admin
   * @param regionAdmin: RegionAdmin
   */
  updateAdmin(regionAdmin: RegionAdmin): Observable<RegionAdmin> {
    return <Observable<RegionAdmin>>super.updateAdmin(regionAdmin);
  }
}
