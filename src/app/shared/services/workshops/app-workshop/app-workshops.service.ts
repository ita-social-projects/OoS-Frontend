import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Workshop, WorkshopCard, WorkshopFilterCard } from '../../../models/workshop.model';
import { FilterStateModel } from '../../../store/filter.state';
@Injectable({
  providedIn: 'root'
})
export class AppWorkshopsService {

  dataUrlMock = '/assets/mock-org-cards.json';

  constructor(private http: HttpClient) { }

  private setParams(filters: FilterStateModel): HttpParams {
    let params = new HttpParams();
    if (filters.searchQuery) {
      params = params.set('title', filters.searchQuery);
    }
    if (filters.city) {
      params = params.set('address.city', filters.city.name);
    }
    if (filters.directions.length > 0) {
      for (let i = 0; i < filters.directions.length; i++) {
        params = params.append('direction.id', filters.directions[i].toString());
      }
    }
    return params;
  }
  /**
  * This method get all workshops
  */
  getAllWorkshops(): Observable<WorkshopCard[]> {
    return this.http.get<WorkshopCard[]>('/Workshop/GetAll');
  }
  /**
  * This method get workshops with applied filter options
  */
  getFilteredWorkshops(filters: FilterStateModel): Observable<WorkshopCard[]> {
    const options = { params: this.setParams(filters) };
    return this.http.get<WorkshopCard[]>('/Workshop/GetAll', options);
  }

  /**
   * This method get top workshops
   */
  getTopWorkshops(): Observable<WorkshopFilterCard[]> {
    return this.http.get<WorkshopFilterCard[]>('/Workshop/GetByFilter?OrderByField=1&Size=4');
  }
}
