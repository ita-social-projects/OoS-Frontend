import { CompanyInformation } from '../../models/сompanyInformation.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PlatformInfoType } from '../../enum/platform';

@Injectable({
  providedIn: 'root'
})
export class PlatformService {

  constructor(private http: HttpClient) { }

  /**
   * This method get information about Platform from the database.
   */
  getPlatformInfo(type: PlatformInfoType): Observable<CompanyInformation> {
    return this.http.get<CompanyInformation>(`/api/v1/${type}/Get`);
  }

  /**
   * This method update information about Platform
   * @param PlatformInfo: CompanyInformation
   */
  updatePlatformInfo(platformInfo: CompanyInformation, type: PlatformInfoType): Observable<CompanyInformation> {
    return this.http.put<CompanyInformation>(`/api/v1/${type}/Update`, platformInfo);
  }
}
