import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { SearchResponse } from '../../../models/search.model';
import { Constants } from '../../../constants/constants';
import { Ordering } from '../../../enum/ordering';
import { Codeficator } from '../../../models/codeficator.model';
import { FilterStateModel } from '../../../models/filter-state.model';
import { PaginationElement } from '../../../models/paginationElement.model';
import { WorkshopCard } from '../../../models/workshop.model';
import { FilterState } from '../../../store/filter.state';
import { PaginatorState } from '../../../store/paginator.state';

@Injectable({
  providedIn: 'root',
})
export class AppWorkshopsService {
  constructor(private http: HttpClient, private store: Store) {}

  private setCityFilterParams(settlement: Codeficator, params: HttpParams): HttpParams {
    params = params.set('Latitude', settlement.latitude.toString());
    params = params.set('Longitude', settlement.longitude.toString());
    params = params.set('catottgId', settlement?.id?.toString() ?? Constants.KYIV.id.toString());

    return params;
  }

  private setParams(filters: FilterStateModel, isMapView: boolean): HttpParams {
    let params = new HttpParams();

    if (filters.settlement && !filters.mapViewCoords) {
      params = this.setCityFilterParams(filters.settlement, params);
    } else if (!!filters.mapViewCoords) {
      const { lat, lng } = filters.mapViewCoords;
      params = params.set('Latitude', lat.toFixed(5).toString());
      params = params.set('Longitude', lng.toFixed(5).toString());
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

    if (filters.isAppropriateAge) {
      params = params.set('IsAppropriateAge', 'true');
    }

    if (filters.startTime) {
      params = params.set('StartHour', filters.startTime);
    }

    if (filters.endTime) {
      params = params.set('EndHour', filters.endTime);
    }

    if (filters.workingDays.length > 0) {
      filters.workingDays.forEach((day: string) => (params = params.append('Workdays', day)));
    }

    if (filters.isFree || !filters.minPrice) {
      params = params.set('IsFree', 'true');
    }

    if (filters.withDisabilityOption) {
      params = params.set('WithDisabilityOptions', 'true');
    }

    if (filters.isAppropriateHours) {
      params = params.set('IsAppropriateHours', 'true');
    }

    if (filters.isStrictWorkdays) {
      params = params.set('IsStrictWorkdays', 'true');
    }

    if (filters.order && !filters.mapViewCoords) {
      params = params.set('OrderByField', filters.order);
    }

    if (!!filters.statuses.length) {
      filters.statuses.forEach((status: string) => (params = params.append('Statuses', status)));
    }

    if (!!filters.directionIds.length) {
      filters.directionIds.forEach((id: number) => (params = params.append('DirectionIds', id.toString())));
    }

    if (isMapView) {
      params = params.set('OrderByField', Ordering.nearest);
      params = params.set('Size', '100');
      params = params.set('From', '0');
    } else {
      const currentPage = this.store.selectSnapshot(PaginatorState.currentPage) as PaginationElement;
      const size: number = this.store.selectSnapshot(PaginatorState.workshopsPerPage);
      const from: number = size * (+currentPage.element - 1);

      params = params.set('Size', size.toString());
      params = params.set('From', from.toString());
    }

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
  getFilteredWorkshops(filters: FilterStateModel, isMapView: boolean): Observable<SearchResponse<WorkshopCard[]>> {
    const options = { params: this.setParams(filters, isMapView) };
    return this.http.get<SearchResponse<WorkshopCard[]>>('/api/v1/Workshop/GetByFilter', options);
  }

  /**
   * This method get top workshops
   */
  getTopWorkshops(): Observable<WorkshopCard[]> {
    let params = new HttpParams();

    const size: number = this.store.selectSnapshot(PaginatorState.workshopsPerPage);
    const settlement: Codeficator = this.store.selectSnapshot(FilterState.settlement);

    params = params.set('Limit', size.toString());
    params = this.setCityFilterParams(settlement, params);

    return this.http.get<WorkshopCard[]>('/api/v1/Statistic/GetWorkshops', { params });
  }
}
