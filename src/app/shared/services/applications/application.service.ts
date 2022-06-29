import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Application, ApplicationCards, ApplicationUpdate } from '../../models/application.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PaginatorState } from '../../store/paginator.state';
import { PaginationElement } from '../../models/paginationElement.model';
import { Store } from '@ngxs/store';
@Injectable({
  providedIn: 'root'
})

export class ApplicationService {

  constructor(
    private http: HttpClient,
    private store: Store,) {
  }

  private setParams(parameters): HttpParams {
    let params = new HttpParams();

    if (parameters.status) {
      params = params.set('Status', parameters.status);
    }

    if (parameters.workshopsId.length) {
      parameters.workshopsId.forEach((workshopId: string) => params = params.append('Workshops', workshopId));
    }
    const currentPage = this.store.selectSnapshot(PaginatorState.currentPage) as PaginationElement;
    const size: number = this.store.selectSnapshot(PaginatorState.applicationsPerPage);
    const from: number = size * (+currentPage.element - 1);
    params = params.set('OrderByDateAscending', 'true'); // TODO: change parameters setting according to the backend updtaes
    params = params.set('OrderByAlphabetically', 'false'); // TODO: change parameters setting according to the backend updtaes
    params = params.set('OrderByStatus', 'true'); // TODO: change parameters setting according to the backend updtaes
    params = params.set('ShowBlocked', parameters.showBlocked);
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
}
