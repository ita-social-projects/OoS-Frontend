import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ApplicationsHistory, FilterData, ProviderAdminsHistory, ProvidersHistory } from '../../models/history-log.model';
import { PaginationElement } from '../../models/paginationElement.model';
import { PaginatorState } from '../../store/paginator.state';

@Injectable({
  providedIn: 'root'
})
export class HistoryLogService {

  constructor(private http: HttpClient, private store: Store) { }

  setParams(filters: FilterData, searchString: string): HttpParams {
    let params = new HttpParams();

    if (filters?.dateFrom) {
      params = params.set('DateFrom', new Date(filters.dateFrom).toISOString());
    }

    if (filters?.dateTo) {
      params = params.set('DateTo', new Date(filters.dateTo).toISOString());
    }

    if (filters?.options) {
      params = params.set('PropertyName', filters.options);
    }

    if (searchString){
      params = params.set('SearchString', searchString);
    }

    const currentPage = this.store.selectSnapshot(
      PaginatorState.currentPage
    ) as PaginationElement;
    const size: number = this.store.selectSnapshot(
      PaginatorState.itemsPerPage
    );
    const from: number = size * (+currentPage.element - 1);

    params = params.set('Size', size.toString());
    params = params.set('From', from.toString());
    return params;
  }

  getProviderHistory(filters: FilterData, searchString: string): Observable<ProvidersHistory> {
    const body = { params: this.setParams(filters, searchString) };
    return this.http.get<ProvidersHistory>(`/api/v1/ChangesLog/Provider`, body);
  }
  getProviderAdminHistory(filters: FilterData, searchString: string): Observable<ProviderAdminsHistory> {
    const body = { params: this.setParams(filters, searchString) };
    return this.http.get<ProviderAdminsHistory>(`/api/v1/ChangesLog/ProviderAdmin`, body);
  }
  getApplicationHistory(filters: FilterData, searchString: string): Observable<ApplicationsHistory> {
    const body = { params: this.setParams(filters, searchString) };
    return this.http.get<ApplicationsHistory>(`/api/v1/ChangesLog/Application`, body);
  }
}
