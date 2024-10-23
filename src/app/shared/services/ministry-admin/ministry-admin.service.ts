import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AdminRoles } from 'shared/enum/admins';
import { MinistryAdmin } from 'shared/models/ministry-admin.model';
import { BaseAdminService } from '../base-admin/base-admin.service';

@Injectable({
  providedIn: 'root'
})
export class MinistryAdminService extends BaseAdminService {
  constructor(protected http: HttpClient) {
    super(http, AdminRoles.ministryAdmin);
  }

  /**
   * This method get Profile of authorized MinistryAdmin
   */
  public getAdminProfile(): Observable<MinistryAdmin> {
    return super.getAdminProfile();
  }

  /**
   * This method get Ministry Admin by Id
   * * @param adminId: string
   */
  public getAdminById(adminId: string): Observable<MinistryAdmin> {
    return super.getAdminById(adminId);
  }

  /**
   * This method create Ministry Admin
   * @param ministryAdmin: MinistryAdmin
   */
  public createAdmin(ministryAdmin: MinistryAdmin): Observable<MinistryAdmin> {
    return super.createAdmin(ministryAdmin);
  }

  /**
   * This method delete Ministry Admin by id
   * @param adminId: string
   */
  public deleteAdmin(adminId: string): Observable<void> {
    return super.deleteAdmin(adminId);
  }

  /**
   * This method block Ministry Admin
   * @param adminId: string
   */
  public blockAdmin(adminId: string, isBlocked: boolean): Observable<void> {
    return super.blockAdmin(adminId, isBlocked);
  }

  /**
   * This method update Ministry Admin
   * @param ministryAdmin: MinistryAdmin
   */
  public updateAdmin(ministryAdmin: MinistryAdmin): Observable<MinistryAdmin> {
    return super.updateAdmin(ministryAdmin);
  }

  /**
   * This method reinvite Ministry Admin
   * @param adminId: string
   */
  public reinviteAdmin(adminId: string): Observable<void> {
    return super.reinviteAdmin(adminId);
  }
}
