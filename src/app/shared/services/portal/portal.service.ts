import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AboutPortal } from '../../models/aboutPortal.model';

@Injectable({
  providedIn: 'root'
})
export class PortalService {

  constructor(private http: HttpClient) { }

  /**
   * This method update information about Portal
   * @param aboutPortal: AboutPortal
   */
   updateInfoAboutPortal(aboutPortal: AboutPortal): Observable<object> {
    return this.http.put('/api/v1/InformationAboutPortal/Update', aboutPortal);
  }
  /**
   * This method get information about Portal from the database.
   */
   getInfoAboutPortal(): Observable<AboutPortal> {
    return this.http.get<AboutPortal>('/api/v1/InformationAboutPortal/Get');
  }
}
