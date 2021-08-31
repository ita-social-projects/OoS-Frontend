import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Application, ApplicationUpdate } from '../../models/application.model';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})

export class ApplicationService {


  dataUrlmock = '/assets/mock-applications.json';

  constructor(private http: HttpClient) {
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
  getApplicationsByProviderId(id: number): Observable<Application[]> {
    return this.http.get<Application[]>(`/Application/GetByPropertyId/provider/${id}`);
  }

    /**
 * This method get applications by status
 * @param status
 */
  getApplicationsByStatus(status: number): Observable<Application[]> {
    return this.http.get<Application[]>(`/Application/GetByStatus?status=${status}`);
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
