import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { InstitutionStatus } from '../../models/institutionStatus.model';
import { Provider } from '../../models/provider.model';

@Injectable({
  providedIn: 'root',
})
export class ProviderService {
  constructor(private http: HttpClient, private store: Store) {}

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
    const param = searchString? `?SearchString=${searchString}` : '';
    return this.http.get<Provider[]>(`/api/v1/Provider/GetByFilter${param}`);
  }

  /**
   * This method create Provider
   * @param Provider
   */
  createProvider(provider: Provider, isRelease3: boolean): Observable<object> {
    return isRelease3 ? this.createProviderV2(provider) : this.createProviderV1(provider);
  }

  createProviderV1(provider: Provider): Observable<object> {
    return this.http.post('/api/v1/Provider/Create', provider);
  }

  createProviderV2(provider: Provider): Observable<object> {
    const formData = Provider.createFormData(provider);
    return this.http.post('/api/v2/Provider/Create', formData);
  }

  /**
   * This method get Provider by User id
   */
  getProfile(): Observable<Provider> {
    return this.http.get<Provider>(`/api/v1/Provider/GetProfile`);
  }

  /**
   * This method update Provider
   * @param Provider
   */
  updateProvider(provider: Provider, isRelease3: boolean): Observable<object> {
    return isRelease3 ? this.updateProviderV2(provider) : this.updateProviderV1(provider);
  }

  updateProviderV1(provider: Provider): Observable<object> {
    return this.http.put('/api/v1/Provider/Update', provider);
  }

  updateProviderV2(provider: Provider): Observable<object> {
    const formData = Provider.createFormData(provider);
    return this.http.put('/api/v2/Provider/Update', formData);
  }

  /**
   * This method get all institution statuses
   */
  getInstitutionStatus(): Observable<InstitutionStatus[]> {
    return this.http.get<InstitutionStatus[]>('/api/v1/InstitutionStatus/Get');
  }
}
