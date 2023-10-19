import { Observable } from 'rxjs';

import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApplicationStatuses } from '../../enum/statuses';
import {
  Application, ApplicationFilterParameters, ApplicationUpdate
} from '../../models/application.model';
import { SearchResponse } from '../../models/search.model';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  constructor(private http: HttpClient) {}

  private setParams(parameters: ApplicationFilterParameters): HttpParams {
    let params = new HttpParams();

    if (parameters) {
      if (parameters.statuses.length) {
        parameters.statuses.forEach((status: ApplicationStatuses) => (params = params.append('Statuses', status)));
      }

      if (parameters.workshops?.length) {
        parameters.workshops.forEach((workshopId: string) => (params = params.append('Workshops', workshopId)));
      }

      if (parameters.children?.length) {
        parameters.children.forEach((childrenId: string) => (params = params.append('Children', childrenId)));
      }

      if (parameters.searchString) {
        params = params.set('SearchString', parameters.searchString);
      }

      if ('size' in parameters && 'from' in parameters) {
        params = params.set('Size', parameters.size.toString()).set('From', parameters.from.toString());
      }
      
      params = params.set('ShowBlocked', parameters.showBlocked.toString());
    }
    params = params.set('OrderByDateAscending', 'true').set('OrderByAlphabetically', 'true').set('OrderByStatus', 'true');

    return params;
  }

  /**
   * This method get applications by Provider id
   * @param id string
   */
  getApplicationsByPropertyId(id: string, parameters: ApplicationFilterParameters): Observable<SearchResponse<Application[]>> {
    const options = { params: this.setParams(parameters) };

    return this.http.get<SearchResponse<Application[]>>(`/api/v1/${parameters.property}/${id}/applications`, options);
  }

  getAllApplications(parameters: ApplicationFilterParameters): Observable<SearchResponse<Application[]>> {
    const options = { params: this.setParams(parameters) };
    return this.http.get<SearchResponse<Application[]>>('/api/v1/applications', options);
  }

  /**
   * This method create Application
   * @param application Application
   */
  createApplication(application: Application): Observable<HttpResponse<Application>> {
    return this.http.post<Application>('/api/v1/applications', application, { observe: 'response' });
  }

  /**
   * This method update Application
   * @param application: ApplicationUpdate
   */
  updateApplication(application: ApplicationUpdate): Observable<Application> {
    return this.http.put<Application>('/api/v1/applications', application);
  }

  /**
   * This method get status if child can apply to workshop by application id and child id
   * @param childId string
   * @param workshopId string
   */
  getStatusIsAllowToApply(childId: string, workshopId: string): Observable<boolean> {
    return this.http.get<boolean>(`/api/v1/applications/allowed/workshops/${workshopId}/children/${childId}`);
  }

  /**
   * This method Check if exists an any application with approve status in workshop for parent
   * @param parentId string
   * @param workshopId string
   */
  getApplicationsAllowedToReview(parentId: string, workshopId: string): Observable<boolean> {
    return this.http.get<boolean>(`/api/v1/applications/reviewable/parents/${parentId}/workshops/${workshopId}`);
  }
}
