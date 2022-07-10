import { AdminTabsTitle } from 'src/app/shared/enum/enumUA/tech-admin/admin-tabs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CompanyInformation } from '../../models/сompanyInformation.model';

@Injectable({
  providedIn: 'root'
})
export class PlatformService {

  constructor(private http: HttpClient) { }

  /**
   * This method get information about Platform from the database.
   */
  getPlatformInfo(type: AdminTabsTitle): Observable<CompanyInformation> {
    return this.http.get<CompanyInformation>(`/api/v1/${AdminTabsTitle[type]}/Get`);
  }

  /**
   * This method update information about Platform
   * @param PlatformInfo: CompanyInformation
   */
  updatePlatformInfo(platformInfo: CompanyInformation, type: AdminTabsTitle): Observable<CompanyInformation> {
    return this.http.put<CompanyInformation>(`/api/v1/${AdminTabsTitle[type]}/Update`, platformInfo);
  }
}
