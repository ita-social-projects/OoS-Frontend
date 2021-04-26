import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Workshop } from '../../../models/workshop.model';

@Injectable({
  providedIn: 'root'
})
export class ParentWorkshopsService {

  constructor(private http: HttpClient) { }

  getWorkshops(): Observable<Workshop[]> {
    return this.http.get<Workshop[]>('/Workshop/Get')
  }

  createWorkshop(workshop): Observable<any> {
    return this.http.post('/Workshop/Create', workshop);
  }
}
