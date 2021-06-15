import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Application } from '../../models/application.model';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})

export class ApplicationService {


  dataUrlmock = '/assets/mock-applications.json';

  constructor(private http: HttpClient) {
  }

  /**
 * This method get all applications
 */
  getApplications(): Observable<Application[]> {
    return this.http.get<Application[]>(`/Application/Get`);
  }

  /**
 * This method get applications by User id
 * @param id
 */
  getApplicationsByUserId(id: string): Observable<Application[]> {
    return this.http.get<Application[]>(`/Application/Get/${id}`);
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
}
