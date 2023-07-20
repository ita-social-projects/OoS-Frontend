import { Observable } from 'rxjs';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';

import { DataItem } from '../../models/item.model';
import {
  BlockProviderData,
  LicenseStatusData,
  Provider,
  ProviderParameters,
  ProviderStatusUpdateData
} from '../../models/provider.model';
import { SearchResponse } from '../../models/search.model';

@Injectable({
  providedIn: 'root'
})
export class ProviderService {
  constructor(private http: HttpClient, private store: Store) {}

  /**
   * This method get Provider by id
   * @param id string
   */
  public getProviderById(id: string): Observable<Provider> {
    return this.http.get<Provider>(`/api/v1/Provider/GetById/${id}`);
  }

  /**
   * This method get filtered Providers from the database
   * @param
   */
  public getFilteredProviders(providerParameters: ProviderParameters): Observable<SearchResponse<Provider[]>> {
    const options = { params: this.setParams(providerParameters) };

    return this.http.get<SearchResponse<Provider[]>>('/api/v1/Provider/GetByFilter', options);
  }

  /**
   * This method create Provider
   * @param Provider
   */
  public createProvider(provider: Provider, isImagesFeature: boolean): Observable<Provider> {
    return isImagesFeature ? this.createProviderV2(provider) : this.createProviderV1(provider);
  }

  /**
   * This method get Provider by User id
   */
  public getProfile(): Observable<Provider> {
    return this.http.get<Provider>('/api/v1/Provider/GetProfile');
  }

  /**
   * This method update Provider
   * @param Provider
   */
  public updateProvider(provider: Provider, isImagesFeature: boolean): Observable<Provider> {
    return isImagesFeature ? this.updateProviderV2(provider) : this.updateProviderV1(provider);
  }

  /**
   * This method update Provider status
   */
  public updateProviderStatus(updateStatus: ProviderStatusUpdateData): Observable<ProviderStatusUpdateData> {
    return this.http.put<ProviderStatusUpdateData>('/api/v1/Provider/StatusUpdate', updateStatus);
  }

  /**
   * This method update Provider status
   */
  public updateProviderLicenseStatus(licenseStatusData: LicenseStatusData): Observable<LicenseStatusData> {
    return this.http.put<LicenseStatusData>('/api/v1/Provider/LicenseStatusUpdate', licenseStatusData);
  }

  /**
   * This method get all institution statuses
   */
  public getInstitutionStatuses(): Observable<DataItem[]> {
    return this.http.get<DataItem[]>('/api/v1/InstitutionStatus/Get');
  }

  /**
   * This method get all provider types
   */
  public getProviderTypes(): Observable<DataItem[]> {
    return this.http.get<DataItem[]>('/api/v1/ProviderType/Get');
  }

  /**
   * This method delete a specific Provider from the database
   */
  public deleteProviderById(id: string): Observable<void> {
    return this.http.delete<void>(`/api/v1/Provider/Delete/${id}`);
  }

  /**
   * This method block a specific Provider from the database
   */
  public blockProvider(provider: BlockProviderData): Observable<void> {
    return this.http.put<void>('/api/v1/Provider/Block', provider);
  }

  private setParams(providerParameters: ProviderParameters): HttpParams {
    let params = new HttpParams();

    if (providerParameters.searchString) {
      params = params.set('SearchString', providerParameters.searchString);
    }
    if (providerParameters.institutionId) {
      params = params.set('InstitutionId', providerParameters.institutionId);
    }
    if (providerParameters.catottgId) {
      params = params.set('CATOTTGId', providerParameters.catottgId);
    }

    params = params.set('Size', providerParameters.size.toString()).set('From', providerParameters.from.toString());

    return params;
  }

  private createProviderV1(provider: Provider): Observable<Provider> {
    return this.http.post<Provider>('/api/v1/Provider/Create', provider);
  }

  private createProviderV2(provider: Provider): Observable<Provider> {
    const formData = Provider.createFormData(provider);
    return this.http.post<Provider>('/api/v2/Provider/Create', formData);
  }

  private updateProviderV1(provider: Provider): Observable<Provider> {
    return this.http.put<Provider>('/api/v1/Provider/Update', provider);
  }

  private updateProviderV2(provider: Provider): Observable<Provider> {
    const formData = Provider.createFormData(provider);
    return this.http.put<Provider>('/api/v2/Provider/Update', formData);
  }
}
