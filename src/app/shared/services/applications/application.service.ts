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
 * This method get applications by User id
 * @param id
 */
  getApplicationsById(id: number): Observable<Application[]> {
    const dataUrl = `/Application/GetById/${id}`;
    return this.http.get<Application[]>(this.dataUrlmock);
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
