import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminRoles } from 'shared/enum/admins';

import { SearchResponse } from '../../models/search.model';
import { TerritorialCommunityAdmin, TerritorialCommunityAdminParameters } from '../../models/territorialCommunityAdmin.model';
import { BaseAdminService } from '../base-admin/base-admin';

@Injectable({
  providedIn: 'root'
})
export class TerritorialCommunityAdminService extends BaseAdminService {
  constructor(protected http: HttpClient) {
    super(http, AdminRoles.areaAdmin);
  }

  /**
   * This method get All TerritorialCommunity Admins
   */
  public getAllAdmin(parameters: TerritorialCommunityAdminParameters): Observable<SearchResponse<TerritorialCommunityAdmin[]>> {
    return super.getAllAdmin(parameters) as Observable<SearchResponse<TerritorialCommunityAdmin[]>>;
  }

  /**
   * This method get TerritorialCommunity Admin by Id
   * @param TerritorialCommunityAdminId string
   */
  public getAdminById(TerritorialCommunityAdminId: string): Observable<TerritorialCommunityAdmin> {
    return super.getAdminById(TerritorialCommunityAdminId) as Observable<TerritorialCommunityAdmin>;
  }

  /**
   * This method get Profile of authorized TerritorialCommunityAdmin
   */
  public getAdminProfile(): Observable<TerritorialCommunityAdmin> {
    return super.getAdminProfile() as Observable<TerritorialCommunityAdmin>;
  }

  /**
   * This method create TerritorialCommunity Admin
   * @param TerritorialCommunityAdmin TerritorialCommunityAdmin
   */
  public createAdmin(TerritorialCommunityAdmin: TerritorialCommunityAdmin): Observable<TerritorialCommunityAdmin> {
    return super.createAdmin(TerritorialCommunityAdmin) as Observable<TerritorialCommunityAdmin>;
  }

  /**
   * This method update TerritorialCommunity Admin
   * @param TerritorialCommunityAdmin TerritorialCommunityAdmin
   */
  public updateAdmin(TerritorialCommunityAdmin: TerritorialCommunityAdmin): Observable<TerritorialCommunityAdmin> {
    return super.updateAdmin(TerritorialCommunityAdmin) as Observable<TerritorialCommunityAdmin>;
  }

  /**
   * This method delete TerritorialCommunity Admin by id
   * @param TerritorialCommunityAdminId string
   */
  public deleteAdmin(TerritorialCommunityAdminId: string): Observable<void> {
    return super.deleteAdmin(TerritorialCommunityAdminId);
  }

  /**
   * This method block TerritorialCommunity Admin
   * @param TerritorialCommunityAdminId string
   * @param isBlocked boolean
   */
  public blockAdmin(TerritorialCommunityAdminId: string, isBlocked: boolean): Observable<void> {
    return super.blockAdmin(TerritorialCommunityAdminId, isBlocked);
  }
}
