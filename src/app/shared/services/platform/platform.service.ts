import { CompanyInformation } from '../../models/сompanyInformation.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminTabTypes } from '../../enum/enumUA/tech-admin/admin-tabs';

@Injectable({
  providedIn: 'root'
})
export class PlatformService {
  constructor(private http: HttpClient) {}

  /**
   * This method get information about Platform from the database.
   */
  getPlatformInfo(type: AdminTabTypes): Observable<CompanyInformation> {
    return this.http.get<CompanyInformation>(`/api/v1/${type}/Get`);
  }

  /**
   * This method update information about Platform
   * @param PlatformInfo: CompanyInformation
   */
  updatePlatformInfo(platformInfo: CompanyInformation, type: AdminTabTypes): Observable<CompanyInformation> {
    return this.http.put<CompanyInformation>(`/api/v1/${type}/Update`, platformInfo);
  }
}
