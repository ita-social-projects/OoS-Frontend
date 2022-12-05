import { Statuses } from './../../enum/statuses';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginatorState } from '../../store/paginator.state';
import { PaginationElement } from '../../models/paginationElement.model';
import { Store } from '@ngxs/store';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Application, ApplicationFilterParameters, ApplicationUpdate } from '../../models/application.model';
import { SearchResponse } from '../../models/search.model';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  constructor(private http: HttpClient, private store: Store) {}

  private setParams(parameters: ApplicationFilterParameters): HttpParams {
    let params = new HttpParams();

    if (parameters) {
      if (parameters.statuses.length) {
        parameters.statuses.forEach((status: Statuses) => (params = params.append('Statuses', status)));
      }

      if (parameters.workshops?.length) {
        parameters.workshops.forEach((workshopId: string) => (params = params.append('Workshops', workshopId)));
      }

      if (parameters.children?.length) {
        parameters.children.forEach((childrenId: string) => (params = params.append('Children', childrenId)));
      }

      params = params.set('ShowBlocked', parameters.showBlocked.toString());
    }
    params = params
      .set('OrderByDateAscending', 'true')
      .set('OrderByAlphabetically', 'true')
      .set('OrderByStatus', 'true');

    const currentPage = this.store.selectSnapshot(PaginatorState.currentPage) as PaginationElement;
    const size = parameters.size ? parameters.size : this.store.selectSnapshot(PaginatorState.applicationsPerPage);
    const from = size * (+currentPage.element - 1);

    params = params.set('Size', size.toString()).set('From', from.toString());

    return params;
  }

  /**
   * This method get applications by Provider id
   * @param id string
   */
  getApplicationsByPropertyId(
    id: string,
    parameters: ApplicationFilterParameters
  ): Observable<SearchResponse<Application[]>> {
    const options = { params: this.setParams(parameters) };

    return this.http.get<SearchResponse<Application[]>>(`/api/v1/${parameters.property}/${id}/applications`, options);
  }

  /**
   * This method create Application
   * @param application Application
   */
  createApplication(application: Application): Observable<HttpResponse<Application>> {
    return this.http.post<Application>('/api/v1/Application/Create', application, { observe: 'response' });
  }

  /**
   * This method delete Application by Application id
   * @param id string
   */
  deleteApplication(id: string): Observable<object> {
    return this.http.delete(`/api/v1/Application/Delete/${id}`);
  }

  /**
   * This method update Application
   * @param application: ApplicationUpdate
   */
  updateApplication(application: ApplicationUpdate): Observable<Application> {
    return this.http.put<Application>('/api/v1/Application/Update', application);
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
    return this.http.get<boolean>(`/api/v1/applications/reviewable/parents/${parentId}/workshops${workshopId}`);
  }
}
