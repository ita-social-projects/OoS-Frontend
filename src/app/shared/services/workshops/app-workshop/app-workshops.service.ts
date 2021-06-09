import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Workshop } from '../../../models/workshop.model';
import { FilterStateModel } from '../../../store/filter.state';
@Injectable({
  providedIn: 'root'
})
export class AppWorkshopsService {

  dataUrlMock = '/assets/mock-org-cards.json';
  dataUrl = '/Workshop/Get';

  constructor(private http: HttpClient) { }

  private setParams(filters: FilterStateModel): HttpParams {
    let params = new HttpParams();
    if (filters.searchQuery) {
      params = params.set('title', filters.searchQuery);
    }
    if (filters.city) {
      params = params.set('address.city', filters.city.city);
    }
    if (filters.categories.length > 0) {
      for (let i = 0; i < filters.categories.length; i++) {
        params = params.append('category.id', filters.categories[i].toString());
      }
    }
    return params;
  }
  /**
  * This method get all workshops
  */
  getAllWorkshops(): Observable<Workshop[]> {
    return this.http.get<Workshop[]>(this.dataUrl);
  }
  /**
  * This method get workshops with applied filter options
  */
  getFilteredWorkshops(filters: FilterStateModel): Observable<Workshop[]> {
    const options = { params: this.setParams(filters) };
    return this.http.get<Workshop[]>(this.dataUrl, options);
  }

  /**
   * This method get top workshops
   */
  getTopWorkshops(): Observable<Workshop[]> {
    return this.http.get<Workshop[]>(this.dataUrl);
  }
}
