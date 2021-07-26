import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Constants } from 'src/app/shared/constants/constants';
import { AgeRange } from 'src/app/shared/models/ageRange.model';
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

    if (filters.ageRange?.length > 0) {
      filters.ageRange.forEach((range: AgeRange) => params = params.set('Ages', JSON.stringify(range)));
    }

    if (filters.directions.length > 0) {
      const directionIds = filters.directions.map((direction: Direction) => direction.id).toString();
      params = params.set('DirectionIds', directionIds);
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
