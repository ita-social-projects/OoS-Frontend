import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PlatformInfoType } from '../../enum/platform';
import { CompanyInformation } from '../../models/сompanyInformation.model';

@Injectable({
  providedIn: 'root'
})
export class PlatformService {
  url = '`/api/v1/${type}/Get`';

  constructor(private http: HttpClient) { }

  /**
   * This method get information about Platform from the database.
   */
   getPlatformInfo(type: PlatformInfoType): Observable<CompanyInformation> {
    let url;
     switch(type) {
      case PlatformInfoType.about:
        url = 'assets/mock-about-info.json'
        break;
      case PlatformInfoType.support:
        url = 'assets/mock-support-info.json';
        break;
      case PlatformInfoType.regulations:
        url = 'assets/mock-regulations-info.json'
        break;
     }
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
