import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PlatformInfoType } from '../../enum/platform';
import { CompanyInformation } from '../../models/сompanyInformation.model';

@Injectable({
  providedIn: 'root'
})
export class PlatformService {

  mockAboutUrl = 'assets/mock-about-info.json';
  mockSupportUrl = 'assets/mock-support-info.json';
  url = '`/api/v1/${type}/Get`';

  constructor(private http: HttpClient) { }

  /**
   * This method get information about Platform from the database.
   */
   getPlatformInfo(type: PlatformInfoType): Observable<CompanyInformation> {
    const url = type=== PlatformInfoType.about ? this.mockAboutUrl : this.mockSupportUrl;

    return this.http.get<CompanyInformation>(url);
  }

  /**
   * This method update information about Platform
   * @param PlatformInfo: CompanyInformation
   */
  updatePlatformInfo(platformInfo: CompanyInformation, type: PlatformInfoType): Observable<CompanyInformation> {
    return this.http.put<CompanyInformation>(`/api/v1/${type}/Update`, platformInfo);
  }
}
