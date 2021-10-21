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

    if (parameters.status !== undefined) {
      params = params.set('Status', parameters.status);
    }

    if (parameters.workshopsId.length) {
      console.log(parameters.workshopsId)
      parameters.workshopsId.forEach((workshopId: number) => params = params.append('Workshops', workshopId.toString()));
    }

    params = params.set('OrderByDateAscending', 'true'); //TODO: change parameters setting according to the backend updtaes
    params = params.set('OrderByAlphabetically', 'false'); //TODO: change parameters setting according to the backend updtaes
    params = params.set('OrderByStatus', 'true'); //TODO: change parameters setting according to the backend updtaes

    return params;
  }



  /**
 * This method get applications by Parent id
 * @param id
 */
  getApplicationsByParentId(id: number): Observable<Application[]> {
    return this.http.get<Application[]>(`/Application/GetByParentId/${id}`);
  }

  /**
 * This method get applications by Provider id
 * @param id
 */
  getApplicationsByProviderId(id: number, parameters): Observable<Application[]> {
    const options = { params: this.setParams(parameters) };

    return this.http.get<Application[]>(`/Application/GetByPropertyId/provider/${id}`, options);
  }

  /**
  * This method create Application
  * @param Workshop
  */
  createApplication(application: Application): Observable<Object> {
    return this.http.post('/Application/Create', application);
  }

  /**
  * This method delete Application by Application id
  * @param id
  */
  deleteApplication(id: number): Observable<Object> {
    return this.http.delete(`Application/Delete/${id}`);
  }

  /**
  * This method update Application
  * @param ApplicationUpdate
  */
  updateApplication(application: ApplicationUpdate): Observable<Object> {
    return this.http.put('/Application/Update', application);
  }
}
