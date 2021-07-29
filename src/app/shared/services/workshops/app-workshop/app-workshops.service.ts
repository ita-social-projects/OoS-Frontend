import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Direction } from 'src/app/shared/models/category.model';

import { WorkshopCard, WorkshopFilterCard } from '../../../models/workshop.model';
import { FilterStateModel } from '../../../store/filter.state';
@Injectable({
  providedIn: 'root'
})
export class AppWorkshopsService {

  dataUrlMock = '/assets/mock-org-cards.json';

  constructor(private http: HttpClient) { }

  private setParams(filters: FilterStateModel): HttpParams {
    let params = new HttpParams();

    if (filters.city) {
      params = params.set('City', filters.city.name);
    }

    if (filters.maxPrice) {
      params = params.set('MaxPrice', filters.maxPrice.toString());
    }

    if (filters.minPrice) {
      params = params.set('MinPrice', filters.minPrice.toString());
    }

    if (filters.searchQuery) {
      params = params.set('SearchText', filters.searchQuery);
    }

    if (filters.minAge) {
      params = params.set('MinAge', filters.minAge.toString());
    }

    if (filters.maxAge) {
      params = params.set('MAxAge', filters.maxAge.toString());
    }

    if (filters.isFree || (filters.minAge === 0)) {
      params = params.set('IsFree', "true");
    }

    if (filters.withDisabilityOption) {
      params = params.set('WithDisabilityOptions', "true");
    }

    if (filters.order) {
      params = params.set('OrderByField', filters.order);
    }

    if (filters.directions.length > 0) {
      filters.directions.forEach((direction: Direction) => params = params.set('DirectionIds', direction.id.toString()));
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
  getFilteredWorkshops(filters: FilterStateModel): Observable<WorkshopFilterCard> {
    const options = { params: this.setParams(filters) };
    return this.http.get<WorkshopFilterCard>('/Workshop/GetByFilter', options);
  }

  /**
   * This method get top workshops
   */
  getTopWorkshops(filters: FilterStateModel): Observable<WorkshopFilterCard> {
    let params = new HttpParams();
    params = params.set('OrderByField', '1');
    params = params.set('Size', '4');

    if (filters.city) {
      params = params.set('City', filters.city.name);
    }

    return this.http.get<WorkshopFilterCard>('/Workshop/GetByFilter', { params });
  }
}
