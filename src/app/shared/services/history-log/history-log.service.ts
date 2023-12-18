import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { 
  ApplicationHistory, 
  FilterData, 
  ParentsBlockingByAdminHistory, 
  ProviderAdminHistory, 
  ProviderHistory 
} from '../../models/history-log.model';
import { SearchResponse } from '../../models/search.model';
import { FilterOptions } from 'shared/enum/history.log';

@Injectable({
  providedIn: 'root'
})
export class HistoryLogService {
  constructor(private http: HttpClient) {}

  private setParams(filters: FilterData, searchString: string, filterOptions?: FilterOptions): HttpParams {
    let params = new HttpParams();

    if (filters?.dateFrom) {
      params = params.set('DateFrom', new Date(filters.dateFrom).toISOString());
    }

    if (filters?.dateTo) {
      params = params.set('DateTo', new Date(filters.dateTo).toISOString());
    }

    if (filters?.options) {
      params = params.set(filterOptions, filters.options);
    }

    if (searchString) {
      params = params.set('SearchString', searchString);
    }

    params = params.set('Size', filters.size.toString()).set('From', filters.from.toString());
    return params;
  }

  public getProviderHistory(filters: FilterData, searchString: string): Observable<SearchResponse<ProviderHistory[]>> {
    const body = { params: this.setParams(filters, searchString, FilterOptions.PropertyName) };
    return this.http.get<SearchResponse<ProviderHistory[]>>('/api/v1/ChangesLog/Provider', body);
  }

  public getProviderAdminHistory(filters: FilterData, searchString: string): Observable<SearchResponse<ProviderAdminHistory[]>> {
    const body = { params: this.setParams(filters, searchString) };
    return this.http.get<SearchResponse<ProviderAdminHistory[]>>('/api/v1/ChangesLog/ProviderAdmin', body);
  }

  public getApplicationHistory(filters: FilterData, searchString: string): Observable<SearchResponse<ApplicationHistory[]>> {
    const body = { params: this.setParams(filters, searchString, FilterOptions.PropertyName) };
    return this.http.get<SearchResponse<ApplicationHistory[]>>('/api/v1/ChangesLog/Application', body);
  }

  public getParentsBlockingByAdminHistory(filters: FilterData, searchString: string): Observable<SearchResponse<ParentsBlockingByAdminHistory[]>> {
    const body = { params: this.setParams(filters, searchString, FilterOptions.ShowParents) };
    return this.http.get<SearchResponse<ParentsBlockingByAdminHistory[]>>('/api/v1/ChangesLog/ParentBlockedByAdmin', body);
  }
}
