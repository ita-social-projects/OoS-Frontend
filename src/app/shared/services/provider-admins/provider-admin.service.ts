import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ProviderAdminBlockData } from 'shared/models/block.model';
import { ProviderAdmin, ProviderAdminParameters } from 'shared/models/provider-admin.model';
import { SearchResponse } from 'shared/models/search.model';

@Injectable({
  providedIn: 'root'
})
export class ProviderAdminService {
  constructor(private http: HttpClient) {}

  /**
   * This method get provider admin by id
   * @param id string
   */
  getProviderAdminById(id: string): Observable<ProviderAdmin> {
    return this.http.get<ProviderAdmin>(`/api/v1/ProviderAdmin/GetProviderAdminById/${id}`);
  }

  /**
   * This method get provider admisn with filter parameters
   */
  getFilteredProviderAdmins(filterParams: ProviderAdminParameters): Observable<SearchResponse<ProviderAdmin[]>> {
    const params = new HttpParams()
      .set('deputyOnly', `${filterParams.deputyOnly}`)
      .set('assistantsOnly', `${filterParams.assistantsOnly}`)
      .set('searchString', `${filterParams.searchString}`)
      .set('from', `${filterParams.from}`)
      .set('size', `${filterParams.size}`);

    return this.http.get<SearchResponse<ProviderAdmin[]>>('/api/v1/ProviderAdmin/GetFilteredProviderAdmins', {
      params
    });
  }

  /**
   * This method create Provider Admin
   * @param providerAdmin: ProviderAdmin
   */
  createProviderAdmin(providerAdmin: ProviderAdmin): Observable<ProviderAdmin> {
    return this.http.post<ProviderAdmin>('/api/v1/ProviderAdmin/Create', providerAdmin);
  }

  /**
   * This method delete Provider Admin
   * @param providerAdminId: string
   * @param providerId: string
   */
  deleteProviderAdmin(providerAdminId: string, providerId: string): Observable<void> {
    const params = new HttpParams().set('providerAdminId', `${providerAdminId}`).set('providerId', `${providerId}`);

    return this.http.delete<void>('/api/v1/ProviderAdmin/Delete', { params });
  }

  /**
   * This method delete Provider Admin
   * @param providerAdminBlockParams: ProviderAdminBlockData
   */
  blockProviderAdmin(providerAdminBlockParams: ProviderAdminBlockData): Observable<void> {
    const params = new HttpParams()
      .set('providerAdminId', `${providerAdminBlockParams.userId}`)
      .set('providerId', `${providerAdminBlockParams.providerId}`)
      .set('isBlocked', `${providerAdminBlockParams.isBlocked}`);

    return this.http.put<void>('/api/v1/ProviderAdmin/Block', {}, { params });
  }

  /**
   * This method update Provider Admin
   * @param providerId: string
   * @param providerAdmin: ProviderAdmin
   */
  updateProviderAdmin(providerId: string, providerAdmin: ProviderAdmin): Observable<ProviderAdmin> {
    const params = new HttpParams().set('providerId', `${providerId}`);

    return this.http.put<ProviderAdmin>('/api/v1/ProviderAdmin/Update', providerAdmin, { params });
  }

  /**
   * This method reinvates provider admin
   * @param providerAdmin: ProviderAdmin
   */
  reinvateProviderAdmin(providerAdmin: ProviderAdmin): Observable<void> {
    return this.http.put<void>(`/api/v1/ProviderAdmin/Reinvite/${providerAdmin.id}`, providerAdmin);
  }
}
