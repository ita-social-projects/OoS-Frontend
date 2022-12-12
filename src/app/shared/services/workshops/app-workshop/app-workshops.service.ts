import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { SearchResponse } from '../../../models/search.model';
import { Constants } from '../../../constants/constants';
import { Ordering } from '../../../enum/ordering';
import { Codeficator } from '../../../models/codeficator.model';
import { FilterStateModel } from '../../../models/filterState.model';
import { PaginationElement } from '../../../models/paginationElement.model';
import { WorkshopCard } from '../../../models/workshop.model';
import { FilterState } from '../../../store/filter.state';
import { PaginatorState } from '../../../store/paginator.state';
import { DefaultFilterFormState } from '../../../../shared/models/defaultFilterFormState.model';

@Injectable({
  providedIn: 'root'
})
export class AppWorkshopsService {
  constructor(private http: HttpClient, private store: Store) {}

  private setCityFilterParams(settlement: Codeficator, params: HttpParams): HttpParams {
    params = params
      .set('Latitude', settlement.latitude.toString())
      .set('Longitude', settlement.longitude.toString())
      .set('catottgId', settlement?.id?.toString() ?? Constants.KYIV.id.toString());

    return params;
  }

  private setParams(filters: FilterStateModel, isMapView: boolean): HttpParams {
    let params = new HttpParams();

    if (filters.settlement && !filters.mapViewCoords) {
      params = this.setCityFilterParams(filters.settlement, params);
    } else if (!!filters.mapViewCoords) {
      const { lat, lng } = filters.mapViewCoords;
      params = params.set('Latitude', lat.toFixed(5).toString()).set('Longitude', lng.toFixed(5).toString());
    }

    if (filters.filterForm.isFree) {
      params = params.set('IsFree', 'true');
    }

    if (filters.filterForm.isPaid) {
      params = this.setIsPaid(filters, params);
    }

    if ((filters.filterForm.isFree && filters.filterForm.isPaid) || (!filters.filterForm.isFree && !filters.filterForm.isPaid)) {
      params = params.set('IsFree', 'true');
      params = this.setIsPaid(filters, params);
    }

    if (filters.filterForm.searchQuery) {
      params = params.set('SearchText', filters.filterForm.searchQuery);
    }

    if (filters.filterForm.minAge) {
      params = params.set('MinAge', filters.filterForm.minAge.toString());
    }

    if (filters.filterForm.maxAge) {
      params = params.set('MaxAge', filters.filterForm.maxAge.toString());
    }

    if (filters.filterForm.isAppropriateAge) {
      params = params.set('IsAppropriateAge', 'true');
    }

    if (filters.filterForm.startTime) {
      params = params.set('StartHour', filters.filterForm.startTime);
    }

    if (filters.filterForm.endTime) {
      params = params.set('EndHour', filters.filterForm.endTime);
    }

    if (filters.filterForm.workingDays.length > 0) {
      filters.filterForm.workingDays.forEach((day: string) => (params = params.append('Workdays', day)));
    }

    if (filters.filterForm.isFree || !filters.filterForm.minPrice) {
      params = params.set('IsFree', 'true');
    }

    if (filters.filterForm.withDisabilityOption) {
      params = params.set('WithDisabilityOptions', 'true');
    }

    if (filters.filterForm.isAppropriateHours) {
      params = params.set('IsAppropriateHours', 'true');
    }

    if (filters.filterForm.isStrictWorkdays) {
      params = params.set('IsStrictWorkdays', 'true');
    }

    if (filters.filterForm.order && !filters.mapViewCoords) {
      params = params.set('OrderByField', filters.filterForm.order);
    }

    if (!!filters.filterForm.statuses.length) {
      filters.filterForm.statuses.forEach((status: string) => (params = params.append('Statuses', status)));
    }

    if (!!filters.filterForm.directionIds.length) {
      filters.filterForm.directionIds.forEach((id: number) => (params = params.append('DirectionIds', id.toString())));
    }

    if (isMapView) {
      params = params.set('OrderByField', Ordering.nearest).set('Size', '100').set('From', '0');
      if (filters.userRadiusSize) {
        params = params.set('RadiusKm', filters.userRadiusSize);
      }
    } else {
      const currentPage = this.store.selectSnapshot(PaginatorState.currentPage) as PaginationElement;
      const size = this.store.selectSnapshot(PaginatorState.workshopsPerPage);
      const from = size * (+currentPage.element - 1);

      params = params.set('Size', size.toString()).set('From', from.toString());
    }

    return params;
  }

  /**
   * This method applied min and max price filter options
   */
  private setIsPaid(filters: FilterStateModel, params: HttpParams): HttpParams {
    if (filters.filterForm.maxPrice) {
      params = params.set('MaxPrice', filters.filterForm.maxPrice.toString());
    }

    if (filters.filterForm.minPrice) {
      params = params.set('MinPrice', filters.filterForm.minPrice.toString());
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

    return this.http.get<WorkshopCard[]>('/api/v1/Statistic/GetWorkshops', {
      params
    });
  }

  checkFilterForChanges(filterForm: DefaultFilterFormState): boolean {
    const currentFilterFormJSON = JSON.stringify(this.store.selectSnapshot(FilterState.filterForm));
    const newFilterFormJSON = JSON.stringify(filterForm);
    return currentFilterFormJSON === newFilterFormJSON;
  }
}
