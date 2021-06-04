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
  getProviderById(id: number): Observable<Provider> {
    return this.http.get<Provider>(`/Provider/Get`);
  }

  /**
  * This method create Provider
  * @param Provider
  */
  createProvider(provider: Provider): any {
    return this.http.post('/Provider/Create', provider);
  }

  /**
  * This method delete Provider by id
  * @param id
  */
  deleteProvider(id: number): any {
    return this.http.delete(`Provider/Delete/${id}`);
  }

  /**
  * This method get Provider by User id
  * @param id
  */
  getProviderByUserId(id: string): Observable<Provider> {
    return this.http.get<Provider>(encodeURI(`Provider/GetProviderByUserId/${id}`));
  }
}
