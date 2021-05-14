import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Application } from '../../models/application.model';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})

export class ApplicationService {

  dataUrl = '/assets/mock-applications.json';

  constructor(private http: HttpClient) {
  }

  getApplications(): Observable<Application[]> {
    return this.http.get<Application[]>(this.dataUrl);
  }
}
