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
      params = params.set('Status', parameters.status.toString());
    }

    if (parameters.OrderByDate !== undefined) {
      params = params.set('OrderByDateAscending', parameters.OrderByDate.toString());
    }

    if (parameters.workshopsId.length) {
      console.log(parameters.workshopsId)
      parameters.workshopsId.forEach((workshopId: number) => params = params.set('Workshops', workshopId.toString()));
    }

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
    const dataUrl = `Application/Delete/${id}`;
    return this.http.delete(dataUrl);
  }

  /**
  * This method update Application
  * @param ApplicationUpdate
  */
  updateApplication(application: ApplicationUpdate): Observable<Object> {
    return this.http.put('/Application/Update', application);
  }
}
