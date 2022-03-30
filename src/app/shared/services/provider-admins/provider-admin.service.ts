import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProviderAdmin } from '../../models/providerAdmin.model';

@Injectable({
  providedIn: 'root',
})
export class ProviderAdminService {
  constructor(private http: HttpClient) { }

  /**
   * This method get all provider Admins
   */
  getAllProviderAdmins(): Observable<ProviderAdmin[]> {
    return this.http.get<ProviderAdmin[]>(
      `/api/v1/ProviderAdmin/GetRelatedProviderAdmins`
    );
  }

  /**
   * This method get children by Parent Child id
   * @param deputyOnly: boolean
   * @param assistantsOnly: boolean
   */
  getFilteredProviderAdmins(
    deputyOnly: boolean,
    assistantsOnly: boolean
  ): Observable<ProviderAdmin> {
    let params = new HttpParams();
    params = params.set('deputyOnly', `${deputyOnly}`);
    params = params.set('assistantsOnly', `${assistantsOnly}`);

    return this.http.get<ProviderAdmin>(
      `/api/v1/ProviderAdmin/GetFilteredProviderAdmins`,
      { params }
    );
  }

  /**
   * This method create Provider Admin
   * @param providerAdmin: ProviderAdmin
   */
  createProviderAdmin(providerAdmin: ProviderAdmin): Observable<object> {
    return this.http.post('/api/v1/ProviderAdmin/Create', providerAdmin);
  }
}
