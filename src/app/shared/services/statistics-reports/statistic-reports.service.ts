import { HttpClient, HttpParams } from '@angular/common/http';
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

  private setParams(parameters: StatisticParameters): HttpParams {
    const params = new HttpParams()
      .set('Size', parameters.size.toString())
      .set('From', parameters.from.toString())
      .set('ReportType', parameters.ReportType)
      .set('ReportDataType', parameters.ReportDataType);

    return params;
  }
}
