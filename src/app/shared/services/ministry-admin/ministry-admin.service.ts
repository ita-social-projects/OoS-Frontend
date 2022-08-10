import { MinistryAdmin } from './../../models/ministryAdmin.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MinistryAdminService {

  constructor(private http: HttpClient) { }

  /**
  * This method get Profile of authorized MinistryAdmin
  */
   getMinistryAdminProfile(): Observable<MinistryAdmin>{
    return this.http.get<MinistryAdmin>(`/api/v1/MinistryAdmin/Profile`);
   }

  /**
   * This method create Ministry Admin
   * @param ministryAdmin: MinistryAdmin
   */
   createMinistryAdmin(ministryAdmin: MinistryAdmin): Observable<MinistryAdmin> {
    return this.http.post<MinistryAdmin>('/api/v1/MinistryAdmin/Create', ministryAdmin);
  }

}
