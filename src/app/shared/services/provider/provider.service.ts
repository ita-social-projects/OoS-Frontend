import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { DataItem } from 'shared/models/item.model';
import { Provider, ProviderWithLicenseStatus, ProviderWithStatus } from 'shared/models/provider.model';

@Injectable({
  providedIn: 'root'
})
export class ProviderService {
  constructor(private http: HttpClient) {}

  /**
   * This method get Provider by id
   * @param id string
   */
  public getProviderById(id: string): Observable<Provider> {
    return this.http.get<Provider>(`/api/v1/Provider/GetById/${id}`);
  }

  /**
   * This method get Provider by User id
   */
  public getProfile(): Observable<Provider> {
    return this.http.get<Provider>('/api/v1/Provider/GetProfile');
  }

  /**
   * This method create Provider
   * @param Provider
   */
  public createProvider(provider: Provider, isImagesFeature: boolean): Observable<Provider> {
    return isImagesFeature ? this.createProviderV2(provider) : this.createProviderV1(provider);
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
  public updateProviderStatus(updateStatus: ProviderWithStatus): Observable<ProviderWithStatus> {
    return this.http.put<ProviderWithStatus>('/api/v1/PublicProvider/StatusUpdate', updateStatus);
  }

  /**
   * This method update Provider status
   */
  public updateProviderLicenseStatus(licenseStatusData: ProviderWithLicenseStatus): Observable<ProviderWithLicenseStatus> {
    return this.http.put<ProviderWithLicenseStatus>('/api/v1/PrivateProvider/LicenseStatusUpdate', licenseStatusData);
  }

  /**
   * This method delete a specific Provider from the database
   */
  public deleteProviderById(id: string): Observable<void> {
    return this.http.delete<void>(`/api/v1/Provider/Delete/${id}`);
  }

  /**
   * This method get all provider types
   */
  public getProviderTypes(): Observable<DataItem[]> {
    return this.http.get<DataItem[]>('/api/v1/ProviderType/Get');
  }

  /**
   * This method get all institution statuses
   */
  public getInstitutionStatuses(): Observable<DataItem[]> {
    return this.http.get<DataItem[]>('/api/v1/InstitutionStatus/Get');
  }

  public getApplicationsCount(): Observable<number> {
    // TODO: Change to correct API when it will be implemented by backend
    return this.http.get<number>('api/v1/Provider/ApplicationsCount');
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
