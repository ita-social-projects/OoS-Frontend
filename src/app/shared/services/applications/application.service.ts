import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Application, ApplicationUpdate } from '../../models/application.model';
import { HttpClient, HttpParams } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})

export class ApplicationService {

  constructor(private http: HttpClient) {
  }

  private setParams(parameters): HttpParams {
    let params = new HttpParams();

    if (parameters.status) {
      params = params.set('Status', parameters.status);
    }

    if (parameters.workshopsId.length) {
      parameters.workshopsId.forEach((workshopId: string) => params = params.append('Workshops', workshopId));
    }

    params = params.set('OrderByDateAscending', 'true'); // TODO: change parameters setting according to the backend updtaes
    params = params.set('OrderByAlphabetically', 'false'); // TODO: change parameters setting according to the backend updtaes
    params = params.set('OrderByStatus', 'true'); // TODO: change parameters setting according to the backend updtaes

    return params;
  }



  /**
   * This method get applications by Parent id
   * @param id string
   */
   getApplicationsByParentId(id: string, status): Observable<Application[]> {
    const options = { params: this.setParams({
      status: status,
      workshopsId: []
    }) };
    return this.http.get<Application[]>(`/api/v1/Application/GetByParentId/${id}`, options);
  }

  /**
   * This method get applications by Provider id
   * @param id string
   */
  getApplicationsByProviderId(id: string, parameters): Observable<Application[]> {
    const options = { params: this.setParams(parameters) };

    return this.http.get<Application[]>(`/api/v1/Application/GetByPropertyId/provider/${id}`, options);
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
    const options = { params: this.setParams({
      childId: childId,
      workshopId: workshopId
    }) };
    return this.http.get<boolean>(`/api/v1/Application/AllowedNewApplicationByChildStatus`, options);
  }
}
