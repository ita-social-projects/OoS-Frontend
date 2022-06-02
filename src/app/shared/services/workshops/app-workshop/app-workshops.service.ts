import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Constants } from 'src/app/shared/constants/constants';
import { Ordering } from 'src/app/shared/enum/ordering';
import { Direction } from 'src/app/shared/models/category.model';
import { PaginationElement } from 'src/app/shared/models/paginationElement.model';
import { MetaDataState } from 'src/app/shared/store/meta-data.state';
import { PaginatorState } from 'src/app/shared/store/paginator.state';

import { WorkshopCard, WorkshopFilterCard } from '../../../models/workshop.model';
import { FilterStateModel } from '../../../store/filter.state';
@Injectable({
  providedIn: 'root'
})
export class AppWorkshopsService {

  dataUrlMock = '/assets/mock-org-cards.json';

  constructor(
    private http: HttpClient,
    private store: Store,
    ) {}

  private setParams(filters: FilterStateModel, isMapView: boolean): HttpParams {
    let params = new HttpParams();

    if (filters.city) {
      params = params.set('City', filters.city.name);
      params = params.set('Latitude', filters.city.latitude.toString());
      params = params.set('Longitude', filters.city.longitude.toString());
    }

    if (filters.isFree) {
      params = params.set('IsFree', 'true');
    }

    if (filters.isPaid) {
      params = this.setIsPaid(filters, params);
    }

    if ((filters.isFree && filters.isPaid) || (!filters.isFree && !filters.isPaid)) {
      params = params.set('IsFree', 'true');
      params = this.setIsPaid(filters, params);
    }

    if (filters.searchQuery) {
      params = params.set('SearchText', filters.searchQuery);
    }

    if (filters.minAge) {
      params = params.set('MinAge', filters.minAge.toString());
    }

    if (filters.maxAge) {
      params = params.set('MaxAge', filters.maxAge.toString());
    }

    if (filters.startTime) {
      params = params.set('StartHour', filters.startTime);
    }

    if (filters.endTime) {
      params = params.set('EndHour', filters.endTime);
    }

    if (filters.workingDays.length > 0) {
      filters.workingDays.forEach((day: string) => params = params.append('Workdays', day));
    }

    if (filters.isFree || !filters.minPrice) {
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

    if (isMapView) {
      params = params.set('OrderByField', Ordering.nearest);
      params = params.set('Size', '100');
      params = params.set('From', '0');
    }

    const currentPage = this.store.selectSnapshot(PaginatorState.currentPage) as PaginationElement;
    const size: number = this.store.selectSnapshot(PaginatorState.workshopsPerPage);
    const from: number = size * (+currentPage.element - 1);
    params = params.set('Size', size.toString());
    params = params.set('From', from.toString());

    return params;
  }

  /**
   * This method applied min and max price filter options
   */
  private setIsPaid(filters: FilterStateModel, params: HttpParams): HttpParams {
    if (filters.maxPrice) {
      params = params.set('MaxPrice', filters.maxPrice.toString());
    }

    if (filters.minPrice) {
      params = params.set('MinPrice', filters.minPrice.toString());
    }
    return params;
  }

  /**
   * This method get workshops with applied filter options
   */
  getFilteredWorkshops(filters: FilterStateModel, isMapView: boolean): Observable<WorkshopFilterCard> {
    const options = { params: this.setParams(filters, isMapView) };
    return this.http.get<WorkshopFilterCard>('/api/v1/Workshop/GetByFilter', options);
  }

  /**
   * This method get top workshops
   */
  getTopWorkshops(filters: FilterStateModel): Observable<WorkshopCard[]> {
    let city = JSON.parse(localStorage.getItem('cityConfirmation'));
    let params = new HttpParams();
    const size: number = this.store.selectSnapshot(PaginatorState.workshopsPerPage);
    params = params.set('Limit', size.toString());
    params = params.set('City', city?.name ?? Constants.KIEV.name);
    return this.http.get<WorkshopCard[]>('/api/v1/Statistic/GetWorkshops', { params });
  }
}
