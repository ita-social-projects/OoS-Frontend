import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { Constants, PaginationConstants } from 'shared/constants/constants';
import { Ordering } from 'shared/enum/ordering';
import { FormOfLearning } from 'shared/enum/workshop';
import { Codeficator } from 'shared/models/codeficator.model';
import { FilterStateModel } from 'shared/models/filter-state.model';
import { SearchResponse } from 'shared/models/search.model';
import { WorkshopCard } from 'shared/models/workshop.model';
import { FilterState } from 'shared/store/filter.state';

@Injectable({
  providedIn: 'root'
})
export class AppWorkshopsService {
  constructor(private http: HttpClient, private store: Store) {}

  /**
   * This method get workshops with applied filter options
   */
  public getFilteredWorkshops(filters: FilterStateModel, isMapView: boolean): Observable<SearchResponse<WorkshopCard[]>> {
    const options = { params: this.setParams(filters, isMapView) };

    return this.http.get<SearchResponse<WorkshopCard[]>>('/api/v1/Workshop/GetByFilter', options);
  }

  /**
   * This method get top workshops
   */
  public getTopWorkshops(): Observable<WorkshopCard[]> {
    let params = new HttpParams();

    const size = PaginationConstants.WORKSHOPS_PER_PAGE;
    const settlement = this.store.selectSnapshot(FilterState.settlement);

    params = params.set('Limit', size);
    params = this.setCityFilterParams(settlement, params);

    return this.http.get<WorkshopCard[]>('/api/v1/popular/workshops', {
      params
    });
  }

  private setParams(filters: FilterStateModel, isMapView: boolean): HttpParams {
    const defaultFilters = {
      from: '0',
      size: '100'
    };
    let params = new HttpParams();

    if (filters.isMapView && filters.mapViewCoords) {
      const { lat, lng } = filters.mapViewCoords;
      params = params.set('Latitude', lat.toFixed(5).toString()).set('Longitude', lng.toFixed(5).toString());
    } else if (filters.settlement) {
      params = this.setCityFilterParams(filters.settlement, params);
    }

    if (filters.formsOfLearning.length) {
      filters.formsOfLearning.forEach((formOfLearning: FormOfLearning) => (params = params.append('FormOfLearning', formOfLearning)));
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
    if (filters.workingDays.length) {
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
    if (filters.order) {
      params = params.set('OrderByField', filters.order);
    }
    if (filters.statuses.length) {
      filters.statuses.forEach((status: string) => (params = params.append('Statuses', status)));
    }
    if (filters.directionIds.length) {
      filters.directionIds.forEach((id: number) => (params = params.append('DirectionIds', id.toString())));
    }

    if (isMapView) {
      params = params.set('OrderByField', Ordering.nearest).set('Size', defaultFilters.size).set('From', defaultFilters.from);
      if (filters.userRadiusSize) {
        params = params.set('RadiusKm', filters.userRadiusSize);
      }
    } else {
      const size = filters?.size?.toString() || defaultFilters.size;
      const from = filters?.from?.toString() || defaultFilters.from;
      params = params.set('Size', size).set('From', from);
    }

    return params;
  }

  private setCityFilterParams(settlement: Codeficator, params: HttpParams): HttpParams {
    params = params
      .set('Latitude', settlement.latitude.toString())
      .set('Longitude', settlement.longitude.toString())
      .set('CATOTTGId', settlement?.id ?? Constants.KYIV.id.toString());

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
}
