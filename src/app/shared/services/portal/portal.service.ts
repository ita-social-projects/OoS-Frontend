import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PortalInfoType } from '../../enum/portal';
import { CompanyInformation } from '../../models/сompanyInformation.model';

@Injectable({
  providedIn: 'root'
})
export class PortalService {

  constructor(private http: HttpClient) { }

  /**
   * This method get information about Portal from the database.
   */
   getPortalInfo(type: PortalInfoType): Observable<CompanyInformation> {
    return this.http.get<CompanyInformation>(`/api/v1/${type}/Get`);
  }

  /**
   * This method update information about Portal
   * @param portalInfo: CompanyInformation
   */
  updatePortalInfo(portalInfo: CompanyInformation, type: PortalInfoType): Observable<CompanyInformation> {
    return this.http.put<CompanyInformation>(`/api/v1/${type}/Update`, portalInfo);
  }
}
