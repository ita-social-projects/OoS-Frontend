import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { PaginationElement } from '../../models/paginationElement.model';
import { SearchResponse } from '../../models/search.model';
import { StatisticParameters, StatisticReport } from '../../models/statistic.model';
import { PaginatorState } from '../../store/paginator.state';

@Injectable({
  providedIn: 'root'
})
export class StatisticReportsService {
  constructor(private http: HttpClient, private store: Store) {}

  getReportsByFilter(parameters: StatisticParameters): Observable<SearchResponse<StatisticReport[]>> {
    const params = this.setParams(parameters);

    return this.http.get<SearchResponse<StatisticReport[]>>(`/api/v1/StatisticReport/GetByFilter`, { params });
  }

  getReportById(id: string): Observable<HttpResponse<Blob>> {
    return this.http.get(`/api/v1/StatisticReport/GetDataById/${id}`, { observe: 'response', responseType: 'blob' });
  }

  private setParams(parameters: StatisticParameters): HttpParams {
    const currentPage = this.store.selectSnapshot(PaginatorState.currentPage) as PaginationElement;
    const size = parameters.size ? parameters.size : this.store.selectSnapshot(PaginatorState.tableItemsPerPage);
    const from = size * (+currentPage.element - 1);

    const params = new HttpParams()
      .set('Size', size.toString())
      .set('From', from.toString())
      .set('ReportType', parameters.ReportType)
      .set('ReportDataType', parameters.ReportDataType);

    return params;
  }
}
