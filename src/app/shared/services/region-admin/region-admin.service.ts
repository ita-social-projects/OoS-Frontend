import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AdminRoles } from 'shared/enum/admins';
import { RegionAdmin, RegionAdminParameters } from 'shared/models/region-admin.model';
import { SearchResponse } from 'shared/models/search.model';
import { BaseAdminService } from '../base-admin/base-admin';

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
  public getAdminProfile(): Observable<RegionAdmin> {
    return super.getAdminProfile() as Observable<RegionAdmin>;
  }

  /**
   * This method get Region Admin by Id
   * * @param regionAdminId: string
   */
  public getAdminById(regionAdminId: string): Observable<RegionAdmin> {
    return super.getAdminById(regionAdminId) as Observable<RegionAdmin>;
  }

  /**
   * This method get All Region Admins
   */
  public getAllAdmin(parameters: RegionAdminParameters): Observable<SearchResponse<RegionAdmin[]>> {
    return super.getAllAdmin(parameters) as Observable<SearchResponse<RegionAdmin[]>>;
  }

  /**
   * This method create Region Admin
   * @param regionAdmin: RegionAdmin
   */
  public createAdmin(regionAdmin: RegionAdmin): Observable<RegionAdmin> {
    return super.createAdmin(regionAdmin) as Observable<RegionAdmin>;
  }

  /**
   * This method delete Region Admin by id
   * @param regionAdminId: string
   */
  public deleteAdmin(regionAdminId: string): Observable<void> {
    return super.deleteAdmin(regionAdminId);
  }

  /**
   * This method block Region Admin
   * @param regionAdminId: string
   */
  public blockAdmin(regionAdminId: string, isBlocked: boolean): Observable<void> {
    return super.blockAdmin(regionAdminId, isBlocked);
  }

  /**
   * This method update Region Admin
   * @param regionAdmin: RegionAdmin
   */
  public updateAdmin(regionAdmin: RegionAdmin): Observable<RegionAdmin> {
    return super.updateAdmin(regionAdmin) as Observable<RegionAdmin>;
  }
}
