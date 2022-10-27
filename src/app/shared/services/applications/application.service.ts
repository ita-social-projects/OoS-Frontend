import { Statuses } from './../../enum/statuses';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginatorState } from '../../store/paginator.state';
import { PaginationElement } from '../../models/paginationElement.model';
import { Store } from '@ngxs/store';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import {
  Application,
  ApplicationParameters,
  ApplicationUpdate
} from '../../models/application.model';
import { SearchResponse } from '../../models/search.model';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  constructor(private http: HttpClient, private store: Store) {}

  private setParams(parameters: ApplicationParameters): HttpParams {
    let params = new HttpParams();

    if (parameters) {
      if (parameters.statuses.length) {
        parameters.statuses.forEach(
          (status: Statuses) => (params = params.append('Statuses', status))
        );
      }

      if (parameters.workshops?.length) {
        parameters.workshops.forEach(
          (workshopId: string) =>
            (params = params.append('Workshops', workshopId))
        );
      }

      if (parameters.children?.length) {
        parameters.children.forEach(
          (childrenId: string) =>
            (params = params.append('Children', childrenId))
        );
      }

      params = params.set('ShowBlocked', parameters.showBlocked.toString());
    }
    params = params.set('OrderByDateAscending', 'true');
    params = params.set('OrderByAlphabetically', 'true');
    params = params.set('OrderByStatus', 'true');

    const currentPage = this.store.selectSnapshot(
      PaginatorState.currentPage
    ) as PaginationElement;
    const size: number = parameters.size
      ? parameters.size
      : this.store.selectSnapshot(PaginatorState.applicationsPerPage);

    const from: number = size * (+currentPage.element - 1);
    params = params.set('Size', size.toString());
    params = params.set('From', from.toString());

    return params;
  }

  /**
   * This method get applications by Parent id
   * @param id string
   */
  getApplicationsByParentId(
    id: string,
    parameters: ApplicationParameters
  ): Observable<SearchResponse<Application[]>> {
    const options = { params: this.setParams(parameters) };
    return this.http.get<SearchResponse<Application[]>>(
      `/api/v1/Application/GetByParentId/${id}`,
      options
    );
  }

  /**
   * This method get applications by Provider id
   * @param id string
   */
  getApplicationsByProviderId(
    id: string,
    parameters: ApplicationParameters
  ): Observable<SearchResponse<Application[]>> {
    const options = { params: this.setParams(parameters) };

    return this.http.get<SearchResponse<Application[]>>(
      `/api/v1/Application/GetByPropertyId/${parameters.property}/${id}`,
      options
    );
  }

  /**
   * This method create Application
   * @param application Application
   */
  createApplication(
    application: Application
  ): Observable<HttpResponse<Application>> {
    return this.http.post<Application>(
      '/api/v1/Application/Create',
      application,
      { observe: 'response' }
    );
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
    return this.http.put<Application>(
      '/api/v1/Application/Update',
      application
    );
  }

  /**
   * This method get status if child can apply to workshop by application id and child id
   * @param childId string
   * @param workshopId string
   */
  getStatusIsAllowToApply(
    childId: string,
    workshopId: string
  ): Observable<boolean> {
    const options = {
      params: {
        childId: childId,
        workshopId: workshopId
      }
    };
    return this.http.get<boolean>(
      '/api/v1/Application/AllowedNewApplicationByChildStatus',
      options
    );
  }

  /**
   * This method Check if exists an any application with approve status in workshop for parent
   * @param id string
   */
  getApplicationsAllowedToReview(
    parentId: string,
    workshopId: string
  ): Observable<boolean> {
    return this.http.get<boolean>('/api/v1/Application/AllowedToReview', {
      params: {
        parentId,
        workshopId
      }
    });
  }

  /**
   * This method Check if exists an any rewiewed application in workshop for parent.
   * @param id string
   */
  getReviewedApplications(
    parentId: string,
    workshopId: string
  ): Observable<boolean> {
    return this.http.get<boolean>('/api/v1/Rating/IsReviewed', {
      params: {
        parentId,
        workshopId
      }
    });
  }
}
