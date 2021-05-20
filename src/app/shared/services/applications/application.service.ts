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
}
