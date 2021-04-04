import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { actCard } from '../../models/activities-card.model';
import { Workshop } from '../../models/workshop.model';

@Injectable({
  providedIn: 'root'
})
export class ProviderActivitiesService {

  constructor(private http: HttpClient) { }

  getCards(): Observable<actCard[]> {
    return this.http.get<actCard[]>('/Workshop/Get')
  }
  createWorkshop(workshop): Observable<Workshop> {
    return this.http.post<Workshop>('/Workshop/Create', workshop)
  }
  createAddress(address): Observable<Workshop> {
    return this.http.post<Workshop>('/Workshop/Create', address)
  }
  createTeachers(teachers): Observable<Workshop> {
    return this.http.post<Workshop>('/Teacher/Create', teachers)
  }
}
