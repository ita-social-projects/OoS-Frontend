import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AdminTabTypes } from 'shared/enum/admins';
import { CompanyInformation } from 'shared/models/company-information.model';

@Injectable({
  providedIn: 'root'
})
export class PlatformService {
  constructor(private http: HttpClient) {}

  /**
   * This method get information about Platform from the database.
   */
  public getPlatformInfo(type: AdminTabTypes): Observable<CompanyInformation> {
    return this.http.get<CompanyInformation>(`/api/v1/${type}/Get`);
  }

  /**
   * This method update information about Platform
   * @param PlatformInfo: CompanyInformation
   */
  public updatePlatformInfo(platformInfo: CompanyInformation, type: AdminTabTypes): Observable<CompanyInformation> {
    return this.http.put<CompanyInformation>(`/api/v1/${type}/Update`, platformInfo);
  }
}
