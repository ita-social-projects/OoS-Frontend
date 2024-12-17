import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { FilterOptions } from 'shared/enum/history.log';
import {
  ApplicationHistory,
  FilterData,
  ParentsBlockingByAdminHistory,
  EmployeeHistory,
  ProviderHistory
} from 'shared/models/history-log.model';
import { SearchResponse } from 'shared/models/search.model';

@Injectable({
  providedIn: 'root'
})
export class HistoryLogService {
  constructor(private http: HttpClient) {}

  public getProviderHistory(filters: FilterData, searchString: string): Observable<SearchResponse<ProviderHistory[]>> {
    const body = { params: this.setParams(filters, searchString) };
    return this.http.get<SearchResponse<ProviderHistory[]>>('/api/v1/ChangesLog/Provider', body);
  }

  public getEmployeeHistory(filters: FilterData, searchString: string): Observable<SearchResponse<EmployeeHistory[]>> {
    const body = { params: this.setParams(filters, searchString) };
    return this.http.get<SearchResponse<EmployeeHistory[]>>('/api/v1/ChangesLog/Employee', body);
  }

  public getApplicationHistory(filters: FilterData, searchString: string): Observable<SearchResponse<ApplicationHistory[]>> {
    const body = { params: this.setParams(filters, searchString) };
    return this.http.get<SearchResponse<ApplicationHistory[]>>('/api/v1/ChangesLog/Application', body);
  }

  public getParentsBlockingByAdminHistory(
    filters: FilterData,
    searchString: string
  ): Observable<SearchResponse<ParentsBlockingByAdminHistory[]>> {
    const body = { params: this.setParams(filters, searchString) };
    return this.http.get<SearchResponse<ParentsBlockingByAdminHistory[]>>('/api/v1/ChangesLog/ParentBlockedByAdmin', body);
  }

  private setParams(filters: FilterData, searchString: string): HttpParams {
    let params = new HttpParams();

    if (filters?.dateFrom) {
      params = params.set('DateFrom', new Date(filters.dateFrom).toISOString());
    }
    if (filters?.dateTo) {
      params = params.set('DateTo', new Date(filters.dateTo).toISOString());
    }
    if (filters?.PropertyName) {
      params = params.set(FilterOptions.PropertyName, filters.PropertyName);
    }
    if (filters?.ShowParents) {
      params = params.set(FilterOptions.ShowParents, filters.ShowParents);
    }
    if (filters?.AdminType) {
      params = params.set(FilterOptions.AdminType, filters.AdminType);
    }
    if (filters?.OperationType) {
      params = params.set(FilterOptions.OperationType, filters.OperationType);
    }
    if (searchString) {
      params = params.set('SearchString', searchString);
    }
    params = params.set('Size', filters.size.toString()).set('From', filters.from.toString());

    return params;
  }
}
