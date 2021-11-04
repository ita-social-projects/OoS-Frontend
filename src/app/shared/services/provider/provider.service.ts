import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Provider } from '../../models/provider.model';

@Injectable({
  providedIn: 'root'
})
export class ProviderService {

  constructor(private http: HttpClient) { }

  /**
  * This method get Provider by id
  * @param id
  */
  getProviderById(id: string): Observable<Provider> {
    return this.http.get<Provider>(`/Provider/GetById/${id}?providerId=${id}`);
  }

  /**
  * This method create Provider
  * @param Provider
  */
  createProvider(provider: Provider): Observable<object> {
    return this.http.post('/Provider/Create', provider);
  }

  /**
  * This method get Provider by User id
  */
  getProfile(): Observable<Provider> {
    return this.http.get<Provider>(`/Provider/GetProfile`);
  }

  /**
 * This method update Provider
 * @param Provider
 */
  updateProvider(provider: Provider): Observable<object> {
    return this.http.put('/Provider/Update', provider);
  }
}
