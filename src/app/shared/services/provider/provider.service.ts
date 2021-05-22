import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Provider } from '../../models/provider.model';

@Injectable({
  providedIn: 'root'
})
export class ProviderService {

  tepmUrl = '/Provider/Get';

  constructor(private http: HttpClient) { }
  /**
  * This method get Provider by id
  * @param id
  */
  getProviderById(id: number): Observable<Provider> {
    const dataUrl = `/Provider/GetById/${id}`;
    return this.http.get<Provider>(this.tepmUrl);
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
    const dataUrl = `Provider/Delete/${id}`;
    return this.http.delete(dataUrl);
  }
}
