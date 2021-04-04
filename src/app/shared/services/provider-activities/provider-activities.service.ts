import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { actCard } from '../../models/activities-card.model';
import { Workshop } from '../../models/workshop.model';

@Injectable({
  providedIn: 'root'
})
export class ProviderActivitiesService {

  createUrl = '/Workshop/Get'
  getUrl = '/Workshop/Get'

  constructor(private http: HttpClient) { }

  getCards(): Observable<actCard[]> {
    return this.http.get<actCard[]>(this.getUrl)
  }
  createWorkshop(workshop): Observable<Workshop> {
    return this.http.post<Workshop>(this.createUrl, workshop)
  }
}
