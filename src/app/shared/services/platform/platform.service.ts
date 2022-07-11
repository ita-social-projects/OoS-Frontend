<<<<<<< HEAD
import { CompanyInformation } from '../../models/сompanyInformation.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PlatformInfoType } from '../../enum/platform';
=======
import { AdminTabsTitle } from 'src/app/shared/enum/enumUA/tech-admin/admin-tabs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CompanyInformation } from '../../models/сompanyInformation.model';
>>>>>>> e148a5f4b97250c9c59ba3d52b90e6c0afb200ec

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
