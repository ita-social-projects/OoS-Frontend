import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SearchResponse } from 'shared/models/search.model';
import { StatisticParameters, StatisticReport } from 'shared/models/statistic.model';

@Injectable({
  providedIn: 'root'
})
export class StatisticReportsService {
  constructor(private http: HttpClient) {}

  public getReportsByFilter(parameters: StatisticParameters): Observable<SearchResponse<StatisticReport[]>> {
    const params = this.setParams(parameters);

    return this.http.get<SearchResponse<StatisticReport[]>>('/api/v1/StatisticReport/GetByFilter', { params });
  }

  public getReportById(id: string): Observable<HttpResponse<Blob>> {
    return this.http.get(`/api/v1/StatisticReport/GetDataById/${id}`, { observe: 'response', responseType: 'blob' });
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
