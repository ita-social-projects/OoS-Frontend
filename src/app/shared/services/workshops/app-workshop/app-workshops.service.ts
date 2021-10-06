import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Constants } from 'src/app/shared/constants/constants';
import { Ordering } from 'src/app/shared/enum/ordering';
import { Direction } from 'src/app/shared/models/category.model';

import { WorkshopCard, WorkshopFilterCard } from '../../../models/workshop.model';
import { FilterStateModel } from '../../../store/filter.state';
@Injectable({
  providedIn: 'root'
})
export class AppWorkshopsService {

  dataUrlMock = '/assets/mock-org-cards.json';
  size: number = Constants.ITEMS_PER_PAGE;

  constructor(private http: HttpClient) { }

  private setParams(filters: FilterStateModel, isMapView: boolean): HttpParams {
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

    if (filters.isFree || !filters.minAge) {
      params = params.set('IsFree', 'true');
    }

    if (filters.withDisabilityOption) {
      params = params.set('WithDisabilityOptions', 'true');
    }

    if (filters.order) {
      params = params.set('OrderByField', filters.order);
    }

    if (filters.directions.length > 0) {
      filters.directions.forEach((direction: Direction) => params = params.append('DirectionIds', direction.id.toString()));
    }

    if (filters.currentPage) {
      const size: number = Constants.ITEMS_PER_PAGE;
      const from: number = size * (+filters.currentPage.element - 1);

      params = params.set('Size', size.toString());
      params = params.set('From', from.toString());
    }

    return params;
  }

  /**
  * This method get workshops with applied filter options
  */
  getFilteredWorkshops(filters: FilterStateModel, isMapView: boolean): Observable<WorkshopFilterCard> {
    const options = { params: this.setParams(filters, isMapView) };
    return this.http.get<WorkshopFilterCard>('/Workshop/GetByFilter', options);
  }

  /**
   * This method get top workshops
   */
  getTopWorkshops(filters: FilterStateModel): Observable<WorkshopCard[]> {
    let params = new HttpParams();
    params = params.set('Limit', this.size.toString());
    return this.http.get<WorkshopCard[]>('/Statistic/GetWorkshops', { params });
  }
}
