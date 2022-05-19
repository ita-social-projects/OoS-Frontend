import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CompanyInformation } from '../../models/сompanyInformation.model';

@Injectable({
  providedIn: 'root'
})
export class PortalService {

  constructor(private http: HttpClient) { }

  /**
   * This method get information about Portal from the database.
   */
   getInfoAboutPortal(): Observable<CompanyInformation> {
    return this.http.get<CompanyInformation>('/api/v1/AboutPortal/Get');
  }

  /**
   * This method update information about Portal
   * @param aboutPortal: AboutPortal
   */
  updateInfoAboutPortal(aboutPortal: CompanyInformation): Observable<CompanyInformation> {
    return this.http.put<CompanyInformation>('/api/v1/AboutPortal/Update', aboutPortal);
  }

  /**
   * This method get information suppor tInformation from the database.
   */
   getSupportInformation(): Observable<CompanyInformation> {
    return this.http.get<CompanyInformation>('/api/v1/SupportInformation/Get');
  }

  /**
   * This method update information support Information
   * @param aboutPortal: AboutPortal
   */
  updateSupportInformation(supportInformation: CompanyInformation): Observable<CompanyInformation> {
    return this.http.put<CompanyInformation>('/api/v1/SupportInformation/Update', supportInformation);
  }
}
