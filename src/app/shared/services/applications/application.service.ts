import { ApplicationParameters } from 'src/app/shared/models/application.model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Application, ApplicationCards, ApplicationUpdate } from '../../models/application.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PaginatorState } from '../../store/paginator.state';
import { PaginationElement } from '../../models/paginationElement.model';
import { Store } from '@ngxs/store';
@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  constructor(private http: HttpClient, private store: Store) {}

  private setParams(parameters: ApplicationParameters): HttpParams {
    let params = new HttpParams();

    if (parameters) {
      if (parameters.statuses.length) {
        params = params.set('Statuses', JSON.stringify(parameters.statuses));
      }

      if (parameters.workshops.length) {
        parameters.workshops.forEach((workshopId: string) => (params = params.append('Workshops', workshopId)));
      }

      params = params.set('ShowBlocked', parameters.showBlocked.toString());
    }

    const currentPage = this.store.selectSnapshot(PaginatorState.currentPage) as PaginationElement;
    const size: number = this.store.selectSnapshot(PaginatorState.applicationsPerPage);
    const from: number = size * (+currentPage.element - 1);
    params = params.set('Size', size.toString());
    params = params.set('From', from.toString());

    return params;
  }

  /**
   * This method get applications by Parent id
   * @param id string
   */
  getApplicationsByParentId(id: string, parameters): Observable<ApplicationCards> {
    const options = { params: this.setParams(parameters) };
    return this.http.get<ApplicationCards>(`/api/v1/Application/GetByParentId/${id}`, options);
  }

  /**
   * This method get applications by Provider id
   * @param id string
   */
  getApplicationsByProviderId(id: string, parameters): Observable<ApplicationCards> {
    const options = { params: this.setParams(parameters) };

    return this.http.get<ApplicationCards>(`/api/v1/Application/GetByPropertyId/provider/${id}`, options);
  }

  /**
   * This method create Application
   * @param Workshop Workshop
   */
  createApplication(application: Application): Observable<object> {
    return this.http.post('/api/v1/Application/Create', application, { observe: 'response' });
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
  updateApplication(application: ApplicationUpdate): Observable<object> {
    return this.http.put('/api/v1/Application/Update', application);
  }

  /**
   * This method get status if child can apply to workshop by application id and child id
   * @param childId string
   * @param workshopId string
   */
  getStatusIsAllowToApply(childId: string, workshopId: string): Observable<boolean> {
    const options = {
      params: {
        childId: childId,
        workshopId: workshopId,
      },
    };
    return this.http.get<boolean>(`/api/v1/Application/AllowedNewApplicationByChildStatus`, options);
  }
}
