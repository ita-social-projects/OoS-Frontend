import { PaginationElement } from './../../models/paginationElement.model';
import { PaginatorState } from './../../store/paginator.state';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { InstitutionStatus } from '../../models/institutionStatus.model';
import { Provider, ProviderStatusUpdateData } from '../../models/provider.model';

@Injectable({
  providedIn: 'root',
})
export class ProviderService {
  constructor(private http: HttpClient, private store: Store) {}

  private setParams(searchString: string): HttpParams {
    let params = new HttpParams();

    if (searchString) {
      params = params.set('SearchString', searchString);
    }

    const currentPage = this.store.selectSnapshot(PaginatorState.currentPage) as PaginationElement;
    const size: number = this.store.selectSnapshot(PaginatorState.directionsPerPage);
    const from: number = size * (+currentPage.element - 1);

    params = params.set('Size', size.toString());
    params = params.set('From', from.toString());

    return params;
  }

  /**
   * This method get Providers from the database
   * @param
   */
  getAllProviders(): Observable<Provider[]> {
    return this.http.get<Provider[]>('/api/v1/Provider/Get');
  }

  /**
   * This method get Provider by id
   * @param id string
   */
  getProviderById(id: string): Observable<Provider> {
    return this.http.get<Provider>(`/api/v1/Provider/GetById/${id}?providerId=${id}`);
  }

  /**
   * This method get filtered Providers from the database
   * @param
   */
  getFilteredProviders(searchString: string): Observable<Provider[]> {
    const options = { params: this.setParams(searchString) };

    return this.http.get<Provider[]>('/api/v1/Provider/GetByFilter', options);
  }

  /**
   * This method create Provider
   * @param Provider
   */
  createProvider(provider: Provider, isRelease3: boolean): Observable<Provider> {
    return isRelease3 ? this.createProviderV2(provider) : this.createProviderV1(provider);
  }

  createProviderV1(provider: Provider): Observable<Provider> {
    return this.http.post<Provider>('/api/v1/Provider/Create', provider);
  }

  createProviderV2(provider: Provider): Observable<Provider> {
    const formData = Provider.createFormData(provider);
    return this.http.post<Provider>('/api/v2/Provider/Create', formData);
  }

  /**
   * This method get Provider by User id
   */
  getProfile(): Observable<Provider> {
    return this.http.get<Provider>('/api/v1/Provider/GetProfile');
  }

  /**
   * This method update Provider
   * @param Provider
   */
  updateProvider(provider: Provider, isRelease3: boolean): Observable<Provider> {
    return isRelease3 ? this.updateProviderV2(provider) : this.updateProviderV1(provider);
  }

  updateProviderV1(provider: Provider): Observable<Provider> {
    return this.http.put<Provider>('/api/v1/Provider/Update', provider);
  }

  updateProviderV2(provider: Provider): Observable<Provider> {
    const formData = Provider.createFormData(provider);
    return this.http.put<Provider>('/api/v2/Provider/Update', formData);
  }

  /**
   * This method update Provider status
   */
  updateProviderStatus(updateStatus: ProviderStatusUpdateData): Observable<ProviderStatusUpdateData> {
    return this.http.put<ProviderStatusUpdateData>('/api/v1/Provider/StatusUpdate', updateStatus);
  }

  /**
   * This method get all institution statuses
   */
  getInstitutionStatus(): Observable<InstitutionStatus[]> {
    return this.http.get<InstitutionStatus[]>('/api/v1/InstitutionStatus/Get');
  }

  /**
   * This method delete a specific Provider from the database
   */
  deleteProviderById(id: string): Observable<void> {
    return this.http.delete<void>(`/api/v1/Provider/Delete/${id}`);
  }
}
